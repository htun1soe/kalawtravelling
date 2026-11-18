import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowUp,
  Bike,
  Car,
  ChevronLeft,
  ChevronRight,
  Compass,
  CornerUpLeft,
  CornerUpRight,
  ExternalLink,
  Flag,
  Footprints,
  Layers,
  LocateFixed,
  Maximize2,
  Minimize2,
  Navigation,
  Pause,
  Play,
  RotateCw,
  X,
} from 'lucide-react';
import { useApp, type TravelModeKey } from '../context/AppContext';
import {
  KALAW_CENTER,
  KALAW_WAYPOINTS,
  getWaypointById,
  type KalawWaypoint,
} from '../data/kalawCoordinates';
import {
  computeBearingDegrees,
  fetchKalawRoute,
  findNearestCoordIndex,
  formatDistanceMeters,
  formatDurationSeconds,
  haversineMeters,
  type ComputedRouteResult,
  type ManeuverKind,
} from '../utils/kalawRouting';

type TileStyle = 'osm' | 'topo';

function ManeuverIcon({ kind, className = 'w-6 h-6' }: { kind: ManeuverKind; className?: string }) {
  switch (kind) {
    case 'left':
      return <CornerUpLeft className={className} />;
    case 'right':
      return <CornerUpRight className={className} />;
    case 'uturn':
    case 'roundabout':
      return <RotateCw className={className} />;
    case 'arrive':
      return <Flag className={className} />;
    default:
      return <ArrowUp className={className} />;
  }
}

function buildTravelerBeaconIcon(bearingDeg: number): L.DivIcon {
  return L.divIcon({
    className: 'kalaw-live-traveler-beacon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;transform:rotate(${Math.round(bearingDeg)}deg);transition:transform 0.28s linear;">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L35 20L22 15.5L9 20L22 2Z" fill="#A4834C" fill-opacity="0.92" stroke="#FAF7F0" stroke-width="1.5"/>
          <circle cx="22" cy="24" r="9" fill="#1B3128" stroke="#FAF7F0" stroke-width="2.8"/>
          <circle cx="22" cy="24" r="3.2" fill="#C7AA74"/>
        </svg>
      </div>
    `,
  });
}

function buildDestPinIcon(): L.DivIcon {
  return L.divIcon({
    className: 'kalaw-live-dest-pin',
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    html: `
      <svg width="34" height="44" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(27,49,40,0.45));">
        <path d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14C1.5 23.3 14 34.5 14 34.5C14 34.5 26.5 23.3 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z" fill="#A4834C" stroke="#1B3128" stroke-width="2"/>
        <circle cx="14" cy="13.5" r="4.5" fill="#1B3128"/>
      </svg>
    `,
  });
}

export const LiveTripCompanion: React.FC = () => {
  const {
    lang,
    t,
    activeTripNav,
    isLiveNavOpen,
    updateActiveTripNav,
    openLiveNav,
    minimizeLiveNav,
    stopVisitNavigation,
  } = useApp();

  const [tileStyle, setTileStyle] = useState<TileStyle>('osm');
  const [route, setRoute] = useState<ComputedRouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const [coordIdx, setCoordIdx] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [followCamera, setFollowCamera] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);
  const [liveGpsCoords, setLiveGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const pathLayerRef = useRef<L.LayerGroup | null>(null);
  const travelerMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);

  const destWaypoint = useMemo<KalawWaypoint>(() => {
    if (!activeTripNav) return KALAW_WAYPOINTS[2];
    return getWaypointById(activeTripNav.destinationId) || KALAW_WAYPOINTS[2];
  }, [activeTripNav]);

  const originWaypoint = useMemo<KalawWaypoint | null>(() => {
    if (!activeTripNav || activeTripNav.originId === 'gps') return null;
    return getWaypointById(activeTripNav.originId) || KALAW_WAYPOINTS[0];
  }, [activeTripNav]);

  const getLabel = useCallback(
    (wp: KalawWaypoint) => (lang === 'my' ? wp.nameMy : wp.nameEn),
    [lang]
  );

  const getArea = useCallback(
    (wp: KalawWaypoint) => (lang === 'my' ? wp.areaMy : wp.areaEn),
    [lang]
  );

  const originLatLng = useMemo(() => {
    if (activeTripNav?.originId === 'gps' && liveGpsCoords) return liveGpsCoords;
    if (originWaypoint) return { lat: originWaypoint.lat, lng: originWaypoint.lng };
    return KALAW_CENTER;
  }, [activeTripNav?.originId, liveGpsCoords, originWaypoint]);

  const destLatLng = useMemo(
    () => ({ lat: destWaypoint.lat, lng: destWaypoint.lng }),
    [destWaypoint]
  );

  // Compute active trip route whenever destination, origin, or travel mode changes
  useEffect(() => {
    if (!activeTripNav) {
      setRoute(null);
      setCoordIdx(0);
      setIsPlayingPreview(false);
      return;
    }

    const controller = new AbortController();
    setRouteLoading(true);
    setCoordIdx(0);
    setFollowCamera(true);

    fetchKalawRoute({
      origin: originLatLng,
      destination: destLatLng,
      travelMode: activeTripNav.travelMode,
      destLabel: getLabel(destWaypoint),
      destArea: getArea(destWaypoint),
      signal: controller.signal,
    })
      .then((res) => {
        if (controller.signal.aborted) return;
        setRoute(res);
        setCoordIdx(0);
        setRouteLoading(false);
        updateActiveTripNav({
          distanceText: res.distanceText,
          durationText: res.durationText,
          currentInstruction: res.steps[0]?.instruction || getLabel(destWaypoint),
          stepIdx: 0,
          totalSteps: res.steps.length,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRouteLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    activeTripNav?.destinationId,
    activeTripNav?.originId,
    activeTripNav?.travelMode,
    originLatLng.lat,
    originLatLng.lng,
    destLatLng.lat,
    destLatLng.lng,
    destWaypoint,
    getLabel,
    getArea,
    updateActiveTripNav,
  ]);

  // Smooth Auto-Preview along the route so users visually feel the journey on desktop or mobile
  useEffect(() => {
    if (!isPlayingPreview || !route || route.coordinates.length < 2) return;
    const total = route.coordinates.length;
    const interval = window.setInterval(() => {
      setCoordIdx((prev) => {
        if (prev >= total - 1) {
          setIsPlayingPreview(false);
          return total - 1;
        }
        const stride = total > 80 ? 2 : 1;
        return Math.min(total - 1, prev + stride);
      });
    }, 340);
    return () => window.clearInterval(interval);
  }, [isPlayingPreview, route]);

  // Real GPS tracking via watchPosition when Live GPS is enabled
  useEffect(() => {
    if (!gpsTracking || !activeTripNav) return;
    if (!navigator.geolocation) {
      setGpsStatusMsg(t.navigationMap.gpsError);
      setGpsTracking(false);
      return;
    }

    setGpsStatusMsg(null);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const nextPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLiveGpsCoords(nextPos);
        const distFromKalaw = haversineMeters(nextPos, KALAW_CENTER);
        // Only snap marker directly on Kalaw route if user is within 60km of Kalaw;
        // otherwise allow switching origin to GPS cleanly
        if (route && route.coordinates.length > 0 && distFromKalaw < 60000) {
          const snappedIdx = findNearestCoordIndex(route.coordinates, [nextPos.lat, nextPos.lng]);
          setCoordIdx(snappedIdx);
        }
      },
      () => {
        setGpsStatusMsg(t.navigationMap.gpsError);
        setGpsTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [gpsTracking, activeTripNav?.destinationId, route, t.navigationMap.gpsError]);

  // Initialize Leaflet map when full Live Nav overlay opens
  useEffect(() => {
    if (!isLiveNavOpen || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [KALAW_CENTER.lat, KALAW_CENTER.lng],
      zoom: 14,
      zoomControl: true,
    });

    const pathLayer = L.layerGroup().addTo(map);

    map.on('dragstart', () => {
      setFollowCamera(false);
    });

    mapRef.current = map;
    pathLayerRef.current = pathLayer;

    const tmr = window.setTimeout(() => map.invalidateSize(), 120);

    return () => {
      window.clearTimeout(tmr);
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      pathLayerRef.current = null;
      travelerMarkerRef.current = null;
      destMarkerRef.current = null;
    };
  }, [isLiveNavOpen]);

  // Tile layer management
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLiveNavOpen) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      tileStyle === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution =
      tileStyle === 'topo'
        ? '&copy; OpenStreetMap contributors, &copy; OpenTopoMap'
        : '&copy; OpenStreetMap contributors';

    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18, attribution }).addTo(map);
  }, [tileStyle, isLiveNavOpen]);

  // Derive current step & remaining progress from coordIdx
  const routeStats = useMemo(() => {
    if (!route || route.coordinates.length === 0) {
      return {
        currentPos: [originLatLng.lat, originLatLng.lng] as [number, number],
        bearing: 0,
        activeStepIdx: 0,
        progressPct: 0,
        remainingDistanceText: '—',
        remainingDurationText: '—',
        arrived: false,
      };
    }

    const coords = route.coordinates;
    const clampedIdx = Math.max(0, Math.min(coords.length - 1, coordIdx));
    const currentPos = coords[clampedIdx];
    const nextPos = coords[Math.min(coords.length - 1, clampedIdx + 1)];
    const prevPos = coords[Math.max(0, clampedIdx - 1)];

    const bearing =
      clampedIdx < coords.length - 1
        ? computeBearingDegrees(currentPos, nextPos)
        : computeBearingDegrees(prevPos, currentPos);

    let activeStepIdx = 0;
    for (let i = 0; i < route.steps.length; i++) {
      if (route.steps[i].coordIndex <= clampedIdx) {
        activeStepIdx = i;
      } else {
        break;
      }
    }

    const fractionCompleted = coords.length > 1 ? clampedIdx / (coords.length - 1) : 1;
    const remainingRatio = Math.max(0, 1 - fractionCompleted);
    const remMeters = Math.round(route.distanceMeters * remainingRatio);
    const remSeconds = Math.round(route.durationSeconds * remainingRatio);
    const arrived = coords.length > 1 && clampedIdx >= coords.length - 1;

    return {
      currentPos,
      bearing,
      activeStepIdx,
      progressPct: Math.round(fractionCompleted * 100),
      remainingDistanceText: arrived ? '0 m' : formatDistanceMeters(remMeters),
      remainingDurationText: arrived ? '0 min' : formatDurationSeconds(remSeconds),
      arrived,
    };
  }, [route, coordIdx, originLatLng]);

  // Keep minimized floating companion HUD synced with current live step & remaining telemetry
  useEffect(() => {
    if (!activeTripNav || !route) return;
    const step = route.steps[routeStats.activeStepIdx];
    updateActiveTripNav({
      distanceText: routeStats.remainingDistanceText,
      durationText: routeStats.remainingDurationText,
      currentInstruction: routeStats.arrived
        ? `${t.navigationMap.arrivedLabel}: ${getLabel(destWaypoint)}`
        : step?.instruction || getLabel(destWaypoint),
      stepIdx: routeStats.activeStepIdx,
      totalSteps: route.steps.length,
    });
  }, [
    routeStats.activeStepIdx,
    routeStats.remainingDistanceText,
    routeStats.remainingDurationText,
    routeStats.arrived,
    route,
    destWaypoint,
    getLabel,
    t.navigationMap.arrivedLabel,
  ]);

  // Render Split Completed / Remaining Polyline + Live Directional Beacon inside Leaflet Map
  useEffect(() => {
    const map = mapRef.current;
    const pathLayer = pathLayerRef.current;
    if (!map || !pathLayer || !isLiveNavOpen || !route) return;

    pathLayer.clearLayers();
    const coords = route.coordinates;
    const clampedIdx = Math.max(0, Math.min(coords.length - 1, coordIdx));

    // Completed portion (behind traveler)
    if (clampedIdx > 0) {
      L.polyline(coords.slice(0, clampedIdx + 1), {
        color: '#4F6047',
        weight: 4,
        opacity: 0.45,
        dashArray: '4 8',
      }).addTo(pathLayer);
    }

    // Remaining portion (ahead of traveler)
    const remainingCoords = coords.slice(clampedIdx);
    const modeColor =
      activeTripNav?.travelMode === 'WALKING'
        ? '#B66F52'
        : activeTripNav?.travelMode === 'TWO_WHEELER'
          ? '#A4834C'
          : '#1B3128';
    const modeDash =
      activeTripNav?.travelMode === 'WALKING'
        ? '3 9'
        : activeTripNav?.travelMode === 'TWO_WHEELER'
          ? '10 6'
          : undefined;

    if (remainingCoords.length >= 2) {
      L.polyline(remainingCoords, {
        color: '#FAF7F0',
        weight: 9,
        opacity: 0.88,
      }).addTo(pathLayer);

      L.polyline(remainingCoords, {
        color: modeColor,
        weight: 5.5,
        opacity: 0.96,
        dashArray: modeDash,
      }).addTo(pathLayer);
    }

    // Update or create Destination Marker
    if (!destMarkerRef.current) {
      destMarkerRef.current = L.marker([destLatLng.lat, destLatLng.lng], {
        icon: buildDestPinIcon(),
        title: getLabel(destWaypoint),
        zIndexOffset: 400,
      }).addTo(map);
    } else {
      destMarkerRef.current.setLatLng([destLatLng.lat, destLatLng.lng]);
    }

    // Update or create Rotating Traveler Directional Beacon
    const beaconIcon = buildTravelerBeaconIcon(routeStats.bearing);
    if (!travelerMarkerRef.current) {
      travelerMarkerRef.current = L.marker(routeStats.currentPos, {
        icon: beaconIcon,
        zIndexOffset: 900,
      }).addTo(map);
    } else {
      travelerMarkerRef.current.setLatLng(routeStats.currentPos);
      travelerMarkerRef.current.setIcon(beaconIcon);
    }

    // Smooth camera pan when follow mode is enabled
    if (followCamera) {
      if (clampedIdx === 0 && coords.length >= 2) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 15 });
      } else {
        map.panTo(routeStats.currentPos, { animate: true, duration: 0.45 });
      }
    }
  }, [
    isLiveNavOpen,
    route,
    coordIdx,
    activeTripNav?.travelMode,
    destLatLng,
    destWaypoint,
    getLabel,
    routeStats.currentPos,
    routeStats.bearing,
    followCamera,
  ]);

  if (!activeTripNav) return null;

  const currentStep = route?.steps[routeStats.activeStepIdx];
  const currentManeuver: ManeuverKind = routeStats.arrived
    ? 'arrive'
    : currentStep?.maneuver || 'straight';

  const handleStepNav = (delta: number) => {
    if (!route || route.steps.length === 0) return;
    setIsPlayingPreview(false);
    setFollowCamera(true);
    const nextStepIdx = Math.max(0, Math.min(route.steps.length - 1, routeStats.activeStepIdx + delta));
    setCoordIdx(route.steps[nextStepIdx].coordIndex);
  };

  const handleRecenter = () => {
    setFollowCamera(true);
    if (mapRef.current && route) {
      mapRef.current.setView(routeStats.currentPos, 15, { animate: true });
    }
  };

  const handleToggleGps = () => {
    if (gpsTracking) {
      setGpsTracking(false);
      return;
    }
    setGpsTracking(true);
    if (!navigator.geolocation) {
      setGpsStatusMsg(t.navigationMap.gpsError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLiveGpsCoords(coords);
        if (haversineMeters(coords, KALAW_CENTER) < 60000) {
          updateActiveTripNav({ originId: 'gps' });
        }
      },
      () => {
        setGpsStatusMsg(t.navigationMap.gpsError);
        setGpsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const osmDirectionsEngine =
    activeTripNav.travelMode === 'WALKING'
      ? 'fossgis_osrm_foot'
      : activeTripNav.travelMode === 'TWO_WHEELER'
        ? 'fossgis_osrm_bike'
        : 'fossgis_osrm_car';
  const osmExternalUrl = `https://www.openstreetmap.org/directions?engine=${osmDirectionsEngine}&route=${originLatLng.lat}%2C${originLatLng.lng}%3B${destLatLng.lat}%2C${destLatLng.lng}`;

  // 1. PERSISTENT FLOATING MINI COMPANION (Stays docked across all pages while trip is active)
  if (!isLiveNavOpen) {
    return (
      <div
        role="region"
        aria-label={t.navigationMap.liveNavTitle}
        className="fixed bottom-4 right-4 z-[60] max-w-sm w-[calc(100vw-2rem)] bg-[#1B3128] text-[#FAF7F0] border border-[#C7AA74]/70 shadow-2xl p-4 space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 bg-[#243D32] border border-[#C7AA74]/50 flex items-center justify-center shrink-0 text-[#C7AA74]">
              <ManeuverIcon kind={currentManeuver} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#C7AA74] font-medium">
                {t.navigationMap.liveNavTitle} · {t.navigationMap.modes[activeTripNav.travelMode]}
              </p>
              <p className="font-serif text-base text-[#FAF7F0] leading-snug">
                {getLabel(destWaypoint)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopVisitNavigation}
            aria-label={t.navigationMap.endTrip}
            className="p-1 text-[#D9CCB8] hover:text-[#FAF7F0] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#D9CCB8] leading-relaxed border-t border-[#FAF7F0]/15 pt-2">
          {activeTripNav.currentInstruction || getLabel(destWaypoint)}
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs font-medium text-[#C7AA74] tabular-nums">
            {activeTripNav.distanceText} · {activeTripNav.durationText}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openLiveNav}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C7AA74] text-[#1B3128] text-xs font-semibold rounded-sm hover:bg-[#FAF7F0] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.navigationMap.resumeMap}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FULL-SCREEN GOOGLE MAPS-STYLE LIVE VISUAL NAVIGATION HUD
  const travelModeButtons: Array<{ key: TravelModeKey; label: string; icon: React.ReactNode }> = [
    { key: 'WALKING', label: t.navigationMap.modes.WALKING, icon: <Footprints className="w-3.5 h-3.5" /> },
    { key: 'TWO_WHEELER', label: t.navigationMap.modes.TWO_WHEELER, icon: <Bike className="w-3.5 h-3.5" /> },
    { key: 'DRIVING', label: t.navigationMap.modes.DRIVING, icon: <Car className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t.navigationMap.liveNavTitle}: ${getLabel(destWaypoint)}`}
      className="fixed inset-0 z-[75] bg-[#1B211D] flex flex-col"
    >
      {/* Top Emerald Turn-by-Turn Guidance Header */}
      <header className="bg-[#1B3128] text-[#FAF7F0] border-b border-[#C7AA74]/40 px-4 md:px-8 py-3.5 shrink-0">
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#243D32] border border-[#C7AA74]/70 flex items-center justify-center shrink-0 text-[#C7AA74]">
              <ManeuverIcon kind={currentManeuver} className="w-7 h-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#C7AA74]">
                <span>{t.navigationMap.liveNavTitle}</span>
                {route && route.steps.length > 0 && (
                  <span className="tabular-nums text-[#D9CCB8]">
                    · {t.navigationMap.stepLabel} {routeStats.activeStepIdx + 1} {t.navigationMap.ofLabel}{' '}
                    {route.steps.length}
                  </span>
                )}
                {currentStep && !routeStats.arrived && (
                  <span className="font-semibold text-[#FAF7F0] tabular-nums">
                    · {currentStep.distanceLabel}
                  </span>
                )}
              </div>
              <p className="font-serif text-xl md:text-2xl text-[#FAF7F0] leading-snug">
                {routeLoading
                  ? t.navigationMap.calculatingRoute
                  : routeStats.arrived
                    ? `${t.navigationMap.arrivedLabel}: ${getLabel(destWaypoint)}`
                    : currentStep?.instruction || getLabel(destWaypoint)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {route && route.steps.length > 1 && (
              <div className="inline-flex items-center border border-[#C7AA74]/40 bg-[#243D32]">
                <button
                  type="button"
                  onClick={() => handleStepNav(-1)}
                  disabled={routeStats.activeStepIdx === 0}
                  className="px-2.5 py-1.5 text-xs text-[#FAF7F0] hover:bg-[#1B3128] disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.navigationMap.prevStep}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStepNav(1)}
                  disabled={routeStats.activeStepIdx >= route.steps.length - 1}
                  className="px-2.5 py-1.5 text-xs text-[#FAF7F0] hover:bg-[#1B3128] border-l border-[#C7AA74]/30 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.navigationMap.nextStep}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={minimizeLiveNav}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#C7AA74]/60 text-[#FAF7F0] hover:bg-[#243D32] text-xs font-medium rounded-sm transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#C7AA74]" />
              <span>{t.navigationMap.minimizeMap}</span>
            </button>

            <button
              type="button"
              onClick={stopVisitNavigation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#B66F52] hover:bg-[#A45D41] text-[#FAF7F0] text-xs font-medium rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.navigationMap.endTrip}</span>
            </button>
          </div>
        </div>

        {/* Hairline Route Progress Bar */}
        <div className="max-w-[1360px] mx-auto mt-3 h-1 bg-[#243D32] overflow-hidden">
          <div
            className="h-full bg-[#C7AA74] transition-all duration-300"
            style={{ width: `${routeStats.progressPct}%` }}
          />
        </div>
      </header>

      {/* Main OpenStreetMap Interactive Guidance Canvas */}
      <div className="flex-1 relative bg-[#EBE5D8] overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Floating Controls (Top-Right) */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setTileStyle((s) => (s === 'osm' ? 'topo' : 'osm'))}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F0]/95 border border-[#A4834C]/55 text-xs font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] shadow-md cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#A4834C]" />
            <span>{tileStyle === 'osm' ? 'Terrain / Topo' : 'Street Map'}</span>
          </button>

          <button
            type="button"
            onClick={handleRecenter}
            className={`inline-flex items-center gap-1.5 px-3 py-2 border text-xs font-medium shadow-md cursor-pointer transition-colors ${
              followCamera
                ? 'bg-[#1B3128] text-[#FAF7F0] border-[#C7AA74]'
                : 'bg-[#FAF7F0]/95 text-[#1B3128] border-[#A4834C]/55 hover:bg-[#1B3128] hover:text-[#FAF7F0]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${followCamera ? 'text-[#C7AA74]' : 'text-[#A4834C]'}`} />
            <span>{followCamera ? t.navigationMap.followMe : t.navigationMap.recenter}</span>
          </button>
        </div>

        {gpsStatusMsg && (
          <div className="absolute top-3 left-14 z-[400] bg-[#FAF7F0]/95 border border-[#B66F52] px-3 py-2 text-xs text-[#B66F52] shadow-md max-w-xs">
            {gpsStatusMsg}
          </div>
        )}
      </div>

      {/* Bottom Google-Maps Style Trip Companion Bar */}
      <footer className="bg-[#FAF7F0] border-t border-[#A4834C]/40 px-4 md:px-8 py-3.5 shrink-0">
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Destination & Remaining Telemetry */}
          <div className="flex flex-wrap items-center gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#4F6047]">
                {t.navigationMap.remainingLabel}
              </p>
              <p className="font-serif text-2xl text-[#1B3128] tabular-nums leading-none mt-0.5">
                {routeLoading ? '...' : `${routeStats.remainingDurationText} · ${routeStats.remainingDistanceText}`}
              </p>
            </div>
            <div className="border-l border-[#D9CCB8] pl-4">
              <p className="text-[11px] text-[#4F6047]">{getArea(destWaypoint)}</p>
              <p className="font-serif text-lg text-[#1B3128] leading-snug">
                {getLabel(destWaypoint)}
              </p>
            </div>
          </div>

          {/* Live Trip Actions: Origin, Travel Mode, Preview Playback, GPS */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Travel Mode Switcher */}
            <div className="inline-flex border border-[#D9CCB8] bg-[#F6F2E9]">
              {travelModeButtons.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => updateActiveTripNav({ travelMode: m.key })}
                  className={`px-2.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTripNav.travelMode === m.key
                      ? 'bg-[#1B3128] text-[#FAF7F0]'
                      : 'text-[#222420]/80 hover:text-[#1B3128]'
                  }`}
                >
                  {m.icon}
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Smooth Visual Route Preview Play/Pause */}
            <button
              type="button"
              onClick={() => {
                if (!route || route.coordinates.length < 2) return;
                if (routeStats.arrived) setCoordIdx(0);
                setFollowCamera(true);
                setIsPlayingPreview((p) => !p);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                isPlayingPreview
                  ? 'bg-[#A4834C] text-[#FAF7F0] border-[#A4834C]'
                  : 'bg-[#1B3128] text-[#FAF7F0] border-[#1B3128] hover:bg-[#4F6047]'
              }`}
            >
              {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#C7AA74]" />}
              <span>{isPlayingPreview ? t.navigationMap.pausePreview : t.navigationMap.previewTrip}</span>
            </button>

            {/* Real GPS Follow Toggle */}
            <button
              type="button"
              onClick={handleToggleGps}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                gpsTracking
                  ? 'bg-[#4F6047] text-[#FAF7F0] border-[#4F6047]'
                  : 'border-[#A4834C]/50 text-[#1B3128] hover:bg-[#A4834C]/15'
              }`}
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>{t.navigationMap.gpsLive}</span>
            </button>

            <a
              href={osmExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 border border-[#D9CCB8] text-xs font-medium text-[#4F6047] hover:text-[#1B3128] rounded-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">OpenStreetMap</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
