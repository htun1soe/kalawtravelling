import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Bike,
  Car,
  Compass,
  ExternalLink,
  Footprints,
  Layers,
  LocateFixed,
  Navigation,
  Plus,
  Route as RouteIcon,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  KALAW_CENTER,
  KALAW_WAYPOINTS,
  getWaypointById,
  type GoalBucket,
  type KalawWaypoint,
} from '../data/kalawCoordinates';

export type GoalFilter = 'all' | GoalBucket;
export type TravelModeKey = 'WALKING' | 'TWO_WHEELER' | 'DRIVING';
type TileStyle = 'osm' | 'topo';

interface RouteStepInfo {
  instruction: string;
  distanceLabel: string;
}

interface ComputedRouteSummary {
  distanceText: string;
  durationText: string;
  steps: RouteStepInfo[];
  usedFallbackMode: boolean;
  isDirectEstimate?: boolean;
}

interface PlacesNavigationMapProps {
  initialDestinationId?: string;
  compact?: boolean;
  hideGoalFilters?: boolean;
}

function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters) || meters <= 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDurationSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatOsrmInstruction(step: {
  name?: string;
  maneuver?: { type?: string; modifier?: string };
}): string {
  const type = step.maneuver?.type || 'continue';
  const mod = step.maneuver?.modifier ? step.maneuver.modifier.replace(/_/g, ' ') : '';
  const road = step.name && step.name.trim().length > 0 ? step.name.trim() : 'mountain road';

  if (type === 'depart') {
    return mod ? `Head ${mod} on ${road}` : `Depart via ${road}`;
  }
  if (type === 'arrive') {
    return `Arrive at destination (${road})`;
  }
  if (type === 'turn') {
    return mod ? `Turn ${mod} onto ${road}` : `Turn onto ${road}`;
  }
  if (type === 'roundabout' || type === 'rotary') {
    return `Take the roundabout onto ${road}`;
  }
  if (type === 'fork') {
    return mod ? `Keep ${mod} at the fork onto ${road}` : `Continue at fork onto ${road}`;
  }
  if (type === 'end of road') {
    return mod ? `At end of road, turn ${mod} onto ${road}` : `Continue onto ${road}`;
  }
  return mod ? `Continue ${mod} on ${road}` : `Follow ${road}`;
}

function buildMarkerIcon(fill: string, stroke: string, scale = 1): L.DivIcon {
  const width = Math.round(28 * scale);
  const height = Math.round(36 * scale);
  return L.divIcon({
    className: 'kalaw-osm-marker',
    iconSize: [width, height],
    iconAnchor: [Math.round(width / 2), height],
    html: `
      <svg width="${width}" height="${height}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(27,49,40,0.35)); cursor: pointer;">
        <path d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14C1.5 23.3 14 34.5 14 34.5C14 34.5 26.5 23.3 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="14" cy="13.5" r="4.5" fill="${stroke}"/>
      </svg>
    `,
  });
}

export const PlacesNavigationMap: React.FC<PlacesNavigationMapProps> = ({
  initialDestinationId = 'dest-1',
  compact = false,
  hideGoalFilters = false,
}) => {
  const {
    lang,
    t,
    destinations,
    stays,
    restaurants,
    properties,
    openItemModal,
    addToTripPlan,
    startVisitNavigation,
  } = useApp();

  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all');
  const [originId, setOriginId] = useState<string>('hub-clock-tower');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [destId, setDestId] = useState<string>(initialDestinationId);
  const [travelMode, setTravelMode] = useState<TravelModeKey>('DRIVING');
  const [tileStyle, setTileStyle] = useState<TileStyle>('osm');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const [routeSummary, setRouteSummary] = useState<ComputedRouteSummary | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (initialDestinationId && getWaypointById(initialDestinationId)) {
      setDestId(initialDestinationId);
    }
  }, [initialDestinationId]);

  const getLabel = useCallback(
    (wp: KalawWaypoint) => (lang === 'my' ? wp.nameMy : wp.nameEn),
    [lang]
  );

  const getArea = useCallback(
    (wp: KalawWaypoint) => (lang === 'my' ? wp.areaMy : wp.areaEn),
    [lang]
  );

  const visibleWaypoints = useMemo(() => {
    const nonProps = KALAW_WAYPOINTS.filter((w) => w.kind !== 'property' || w.id === destId);
    if (goalFilter === 'all') return nonProps;
    return nonProps.filter(
      (w) => w.goalBucket === goalFilter || w.kind === 'hub' || w.id === destId || w.id === originId
    );
  }, [goalFilter, destId, originId]);

  const selectableDestinations = useMemo(() => {
    if (goalFilter === 'all') {
      return KALAW_WAYPOINTS.filter(
        (w) =>
          w.kind === 'destination' ||
          w.kind === 'stay' ||
          w.kind === 'restaurant' ||
          w.id === destId
      );
    }
    return KALAW_WAYPOINTS.filter((w) => w.goalBucket === goalFilter || w.id === destId);
  }, [goalFilter, destId]);

  const originWaypoint =
    originId === 'gps' ? null : getWaypointById(originId) || KALAW_WAYPOINTS[0];
  const destWaypoint = getWaypointById(destId) || KALAW_WAYPOINTS[2];

  const originLatLng = useMemo(() => {
    if (originId === 'gps' && gpsCoords) return gpsCoords;
    if (originWaypoint) return { lat: originWaypoint.lat, lng: originWaypoint.lng };
    return KALAW_CENTER;
  }, [originId, gpsCoords, originWaypoint]);

  const destLatLng = useMemo(
    () => ({ lat: destWaypoint.lat, lng: destWaypoint.lng }),
    [destWaypoint]
  );

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [KALAW_CENTER.lat, KALAW_CENTER.lng],
      zoom: 13,
      zoomControl: true,
    });

    const markersLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    routeLayerRef.current = routeLayer;

    // Ensure proper sizing if rendered inside animated containers or modals
    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // Switch OpenStreetMap / OpenTopoMap tile layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution,
    }).addTo(map);
  }, [tileStyle]);

  // Render Waypoint Markers
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;
    markersLayer.clearLayers();

    if (originId === 'gps' && gpsCoords) {
      const gpsMarker = L.marker([gpsCoords.lat, gpsCoords.lng], {
        icon: buildMarkerIcon('#4F6047', '#FAF7F0', 1),
        title: t.navigationMap.gpsOriginLabel,
      });
      gpsMarker.addTo(markersLayer);
    }

    visibleWaypoints.forEach((wp) => {
      const isDest = wp.id === destId;
      const isOrigin = wp.id === originId;
      const fill = isDest ? '#A4834C' : isOrigin ? '#1B3128' : '#243D32';
      const stroke = isDest ? '#1B3128' : '#FAF7F0';
      const marker = L.marker([wp.lat, wp.lng], {
        icon: buildMarkerIcon(fill, stroke, isDest ? 1.18 : 0.94),
        title: getLabel(wp),
        zIndexOffset: isDest ? 500 : isOrigin ? 300 : 100,
      });
      marker.on('click', () => {
        setActivePinId(wp.id);
      });
      marker.addTo(markersLayer);
    });
  }, [visibleWaypoints, destId, originId, gpsCoords, getLabel, t.navigationMap.gpsOriginLabel]);

  // Compute Route via FOSSGIS OSRM mode-specific servers (with clean highland fallback)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    if (
      Math.abs(originLatLng.lat - destLatLng.lat) < 0.0001 &&
      Math.abs(originLatLng.lng - destLatLng.lng) < 0.0001
    ) {
      routeLayer.clearLayers();
      setRouteSummary({
        distanceText: '0 m',
        durationText: '1 min',
        steps: [],
        usedFallbackMode: false,
      });
      setRouteLoading(false);
      map.setView([destLatLng.lat, destLatLng.lng], 15);
      return;
    }

    const controller = new AbortController();
    setRouteLoading(true);

    const fossgisProfile =
      travelMode === 'WALKING'
        ? 'routed-foot'
        : travelMode === 'TWO_WHEELER'
          ? 'routed-bike'
          : 'routed-car';

    const coordsSegment = `${originLatLng.lng},${originLatLng.lat};${destLatLng.lng},${destLatLng.lat}`;
    const url = `https://routing.openstreetmap.de/${fossgisProfile}/route/v1/driving/${coordsSegment}?overview=full&geometries=geojson&steps=true`;

    const styleForMode =
      travelMode === 'WALKING'
        ? { color: '#B66F52', weight: 5, opacity: 0.95, dashArray: '3 9' }
        : travelMode === 'TWO_WHEELER'
          ? { color: '#A4834C', weight: 5, opacity: 0.95, dashArray: '10 6' }
          : { color: '#1B3128', weight: 5.5, opacity: 0.92 };

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('OSRM failed'))))
      .then(
        (data: {
          code?: string;
          routes?: Array<{
            distance?: number;
            duration?: number;
            geometry?: { coordinates?: Array<[number, number]> };
            legs?: Array<{
              steps?: Array<{
                distance?: number;
                name?: string;
                maneuver?: { type?: string; modifier?: string };
              }>;
            }>;
          }>;
        }) => {
          if (controller.signal.aborted) return;
          const primary = data.routes?.[0];
          const coords = primary?.geometry?.coordinates;

          if (!primary || !coords || coords.length < 2) {
            throw new Error('No route geometry');
          }

          routeLayer.clearLayers();
          const latLngs: L.LatLngExpression[] = coords.map(([lng, lat]) => [lat, lng]);

          // Subtle cream under-halo so dashed/dotted walking & scooter routes stand out over streets
          L.polyline(latLngs, {
            color: '#FAF7F0',
            weight: 8,
            opacity: 0.85,
          }).addTo(routeLayer);

          const polyline = L.polyline(latLngs, styleForMode).addTo(routeLayer);

          map.fitBounds(polyline.getBounds(), { padding: [46, 46], maxZoom: 15 });

          const rawSteps = primary.legs?.[0]?.steps || [];
          const steps: RouteStepInfo[] = rawSteps
            .filter((s) => (s.distance || 0) > 10 || s.maneuver?.type === 'arrive')
            .map((s) => ({
              instruction: formatOsrmInstruction(s),
              distanceLabel: formatDistanceMeters(s.distance || 0),
            }));

          // routed-bike speeds model ~12 km/h pedaling; calibrate TWO_WHEELER to ~24 km/h scooter speed
          const rawDuration = primary.duration || 0;
          const distanceMeters = primary.distance || 0;
          const calibratedDuration =
            travelMode === 'TWO_WHEELER'
              ? Math.max(60, Math.round(rawDuration * 0.55))
              : travelMode === 'WALKING'
                ? Math.max(60, rawDuration || Math.round(distanceMeters / 1.2))
                : Math.max(60, rawDuration);

          setRouteSummary({
            distanceText: formatDistanceMeters(distanceMeters),
            durationText: formatDurationSeconds(calibratedDuration),
            steps,
            usedFallbackMode: false,
          });
          setRouteLoading(false);
        }
      )
      .catch((err: unknown) => {
        if (controller.signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
          return;
        }
        // Clean geographic highland corridor estimate when routing server is unavailable
        routeLayer.clearLayers();
        const directLine = L.polyline(
          [
            [originLatLng.lat, originLatLng.lng],
            [destLatLng.lat, destLatLng.lng],
          ],
          {
            ...styleForMode,
            dashArray: travelMode === 'DRIVING' ? '8 8' : styleForMode.dashArray,
          }
        ).addTo(routeLayer);

        map.fitBounds(directLine.getBounds(), { padding: [50, 50], maxZoom: 15 });

        const straightMeters = haversineMeters(originLatLng, destLatLng);
        const estimatedRoadMeters = Math.round(straightMeters * 1.35);
        const speedMps =
          travelMode === 'WALKING' ? 1.15 : travelMode === 'TWO_WHEELER' ? 7.2 : 9.5;
        const estimatedSeconds = estimatedRoadMeters / speedMps;

        setRouteSummary({
          distanceText: `~${formatDistanceMeters(estimatedRoadMeters)}`,
          durationText: `~${formatDurationSeconds(estimatedSeconds)}`,
          steps: [
            {
              instruction: `Head toward ${getLabel(destWaypoint)} (${getArea(destWaypoint)})`,
              distanceLabel: formatDistanceMeters(estimatedRoadMeters),
            },
          ],
          usedFallbackMode: false,
          isDirectEstimate: true,
        });
        setRouteLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [originLatLng, destLatLng, travelMode, destWaypoint, getLabel, getArea]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError(t.navigationMap.gpsError);
      return;
    }
    setLocatingGps(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOriginId('gps');
        setLocatingGps(false);
      },
      () => {
        setGpsError(t.navigationMap.gpsError);
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleInspectWaypoint = (wp: KalawWaypoint) => {
    if (wp.kind === 'destination') {
      const found = destinations.find((d) => d.id === wp.id);
      if (found) openItemModal({ kind: 'destination', data: found });
    } else if (wp.kind === 'stay') {
      const found = stays.find((s) => s.id === wp.id);
      if (found) openItemModal({ kind: 'stay', data: found });
    } else if (wp.kind === 'restaurant') {
      const found = restaurants.find((r) => r.id === wp.id);
      if (found) openItemModal({ kind: 'restaurant', data: found });
    } else if (wp.kind === 'property') {
      const found = properties.find((p) => p.id === wp.id);
      if (found) openItemModal({ kind: 'property', data: found });
    }
  };

  const handleAddStop = (wp: KalawWaypoint) => {
    if (wp.kind === 'hub' || wp.kind === 'property') return;
    addToTripPlan({
      day: 1,
      type: wp.kind,
      itemId: wp.id,
      title: getLabel(wp),
      location: getArea(wp),
      timeSlot: routeSummary ? `${routeSummary.durationText} route` : 'Planned Stop',
    });
    setAddedPlanId(wp.id);
  };

  const activePinWaypoint = activePinId ? getWaypointById(activePinId) : null;

  const osmDirectionsEngine =
    travelMode === 'WALKING'
      ? 'fossgis_osrm_foot'
      : travelMode === 'TWO_WHEELER'
        ? 'fossgis_osrm_bike'
        : 'fossgis_osrm_car';
  const osmExternalUrl = `https://www.openstreetmap.org/directions?engine=${osmDirectionsEngine}&route=${originLatLng.lat}%2C${originLatLng.lng}%3B${destLatLng.lat}%2C${destLatLng.lng}`;

  const goalButtons: Array<{ key: GoalFilter; label: string }> = [
    { key: 'all', label: t.navigationMap.goals.all },
    { key: 'sunrise', label: t.navigationMap.goals.sunrise },
    { key: 'trekking', label: t.navigationMap.goals.trekking },
    { key: 'heritage', label: t.navigationMap.goals.heritage },
    { key: 'staysDining', label: t.navigationMap.goals.staysDining },
  ];

  const travelModeButtons: Array<{ key: TravelModeKey; label: string; icon: React.ReactNode }> = [
    {
      key: 'WALKING',
      label: t.navigationMap.modes.WALKING,
      icon: <Footprints className="w-3.5 h-3.5" />,
    },
    {
      key: 'TWO_WHEELER',
      label: t.navigationMap.modes.TWO_WHEELER,
      icon: <Bike className="w-3.5 h-3.5" />,
    },
    {
      key: 'DRIVING',
      label: t.navigationMap.modes.DRIVING,
      icon: <Car className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      id="places-navigator"
      className={`bg-[#FAF7F0] luxury-frame ${compact ? 'p-4 md:p-5 space-y-4' : 'p-6 md:p-8 space-y-6'}`}
    >
      {/* Header & OpenStreetMap Layer Toggle */}
      {!compact && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#A4834C]/25 pb-5">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A4834C] font-medium flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.navigationMap.eyebrow} · OpenStreetMap</span>
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B3128]">
              {t.navigationMap.title}
            </h2>
            <p className="text-sm text-[#222420]/75 leading-relaxed">
              {t.navigationMap.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTileStyle((s) => (s === 'osm' ? 'topo' : 'osm'))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#A4834C]/50 text-xs font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors rounded-sm cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5 text-[#A4834C]" />
              <span>{tileStyle === 'osm' ? 'Terrain / Topo' : 'Street Map'}</span>
            </button>
            <a
              href={osmExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D9CCB8] text-xs font-medium text-[#4F6047] hover:text-[#1B3128] hover:border-[#A4834C] transition-colors rounded-sm whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>OpenStreetMap</span>
            </a>
          </div>
        </div>
      )}

      {!hideGoalFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4F6047] font-medium mr-1">
            {t.navigationMap.goalLabel}:
          </span>
          {goalButtons.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setGoalFilter(g.key)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                goalFilter === g.key
                  ? 'bg-[#1B3128] text-[#FAF7F0]'
                  : 'border border-[#D9CCB8] text-[#222420]/80 hover:border-[#A4834C] hover:text-[#1B3128]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Split: Controls + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls & Turn-by-Turn Panel */}
        <div
          className={`${compact ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-4 bg-[#F6F2E9] border border-[#D9CCB8] p-4 md:p-5`}
        >
          {/* Origin Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-medium text-[#4F6047]">
                {t.navigationMap.originLabel}
              </label>
              <button
                type="button"
                onClick={handleUseGps}
                disabled={locatingGps}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A4834C] hover:text-[#1B3128] transition-colors cursor-pointer"
              >
                <LocateFixed className="w-3 h-3" />
                <span>
                  {locatingGps ? t.navigationMap.locatingGps : t.navigationMap.useCurrentLocation}
                </span>
              </button>
            </div>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              aria-label={t.navigationMap.originLabel}
              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
            >
              {gpsCoords && <option value="gps">{t.navigationMap.gpsOriginLabel}</option>}
              <optgroup label={t.navigationMap.startingHubsGroup}>
                {KALAW_WAYPOINTS.filter((w) => w.kind === 'hub').map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {getLabel(wp)}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t.navigationMap.placesGroup}>
                {KALAW_WAYPOINTS.filter((w) => w.kind === 'destination').map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {getLabel(wp)}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t.navigationMap.staysDiningGroup}>
                {KALAW_WAYPOINTS.filter((w) => w.kind === 'stay' || w.kind === 'restaurant').map(
                  (wp) => (
                    <option key={wp.id} value={wp.id}>
                      {getLabel(wp)}
                    </option>
                  )
                )}
              </optgroup>
            </select>
            {gpsError && <p className="text-[11px] text-[#B66F52]">{gpsError}</p>}
          </div>

          {/* Destination Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4F6047] block">
              {t.navigationMap.destinationLabel}
            </label>
            <select
              value={destId}
              onChange={(e) => {
                setDestId(e.target.value);
                setAddedPlanId(null);
              }}
              aria-label={t.navigationMap.destinationLabel}
              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
            >
              {selectableDestinations.map((wp) => (
                <option key={wp.id} value={wp.id}>
                  {getLabel(wp)}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Mode Switcher */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-[#4F6047] block">
              {t.navigationMap.travelModeLabel}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {travelModeButtons.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setTravelMode(m.key)}
                  className={`py-2 px-2 text-[11px] font-medium border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    travelMode === m.key
                      ? 'bg-[#1B3128] text-[#FAF7F0] border-[#1B3128]'
                      : 'bg-[#FAF7F0] text-[#222420]/80 border-[#D9CCB8] hover:border-[#A4834C]'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Route Metrics */}
          <div className="border-t border-b border-[#A4834C]/25 py-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#4F6047]">{t.navigationMap.distanceLabel}</p>
              <p className="font-serif text-xl text-[#1B3128] tabular-nums">
                {routeLoading ? '...' : routeSummary?.distanceText || '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#4F6047]">{t.navigationMap.durationLabel}</p>
              <p className="font-serif text-xl text-[#1B3128] tabular-nums">
                {routeLoading ? '...' : routeSummary?.durationText || '—'}
              </p>
            </div>
          </div>

          {/* Turn-by-Turn Directions */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B3128] flex items-center gap-1.5">
              <RouteIcon className="w-3.5 h-3.5 text-[#A4834C]" />
              <span>{t.navigationMap.turnByTurnTitle}</span>
            </h3>
            {routeLoading ? (
              <p className="text-xs text-[#4F6047]">{t.navigationMap.calculatingRoute}</p>
            ) : routeSummary && routeSummary.steps.length > 0 ? (
              <ol className="max-h-48 overflow-y-auto pr-1 space-y-2 text-xs text-[#222420]/85 divide-y divide-[#D9CCB8]/60">
                {routeSummary.steps.map((step, idx) => (
                  <li key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                    <span className="leading-relaxed">
                      <span className="font-semibold text-[#1B3128] mr-1.5 tabular-nums">
                        {idx + 1}.
                      </span>
                      {step.instruction}
                    </span>
                    <span className="text-[11px] text-[#4F6047] tabular-nums shrink-0">
                      {step.distanceLabel}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-[#4F6047]">{t.navigationMap.noStepsYet}</p>
            )}
          </div>

          {/* Direct Destination Action Buttons */}
          <div className="pt-2 space-y-2 border-t border-[#D9CCB8]">
            <button
              type="button"
              onClick={() => startVisitNavigation(destWaypoint.id, { originId, travelMode })}
              className="w-full py-2.5 px-4 bg-[#A4834C] hover:bg-[#1B3128] text-[#FAF7F0] text-xs font-semibold rounded-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.navigationMap.visitAction}</span>
            </button>

            {destWaypoint.kind !== 'hub' && (
              <div className="flex flex-wrap gap-2">
                {!compact && destWaypoint.kind !== 'property' && (
                  <button
                    type="button"
                    onClick={() => handleInspectWaypoint(destWaypoint)}
                    className="flex-1 py-2 px-3 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.navigationMap.openDossier}
                  </button>
                )}
                {destWaypoint.kind !== 'property' && (
                  <button
                    type="button"
                    onClick={() => handleAddStop(destWaypoint)}
                    className="flex-1 py-2 px-3 border border-[#A4834C] text-[#1B3128] text-xs font-medium rounded-sm hover:bg-[#A4834C]/15 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {addedPlanId === destWaypoint.id ? (
                      <>
                        <Compass className="w-3.5 h-3.5 text-[#A4834C]" />
                        <span>{t.navigationMap.addedStop}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.navigationMap.addStopToPlan}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Interactive OpenStreetMap Canvas */}
        <div
          className={`${compact ? 'lg:col-span-7 h-[300px] lg:h-[360px]' : 'lg:col-span-8 h-[440px] lg:h-[540px]'} w-full border border-[#A4834C]/35 bg-[#EBE5D8] relative overflow-hidden`}
        >
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Live Travel Mode & Route Summary Card on Map Canvas */}
          <div className="absolute top-3 right-3 z-[400] bg-[#FAF7F0]/95 backdrop-blur-xs border border-[#A4834C]/55 px-3 py-2 shadow-sm flex items-center gap-2.5 text-xs text-[#1B3128]">
            <span
              className="w-5 inline-block shrink-0"
              style={{
                borderTopWidth: '3px',
                borderTopStyle:
                  travelMode === 'WALKING'
                    ? 'dotted'
                    : travelMode === 'TWO_WHEELER'
                      ? 'dashed'
                      : 'solid',
                borderTopColor:
                  travelMode === 'WALKING'
                    ? '#B66F52'
                    : travelMode === 'TWO_WHEELER'
                      ? '#A4834C'
                      : '#1B3128',
              }}
            />
            <span className="font-medium">{t.navigationMap.modes[travelMode]}</span>
            <span className="text-[#A4834C]">·</span>
            <span className="tabular-nums text-[#4F6047]">
              {routeLoading
                ? '...'
                : `${routeSummary?.distanceText || '—'} · ${routeSummary?.durationText || '—'}`}
            </span>
          </div>

          {/* Selected Pin Info Drawer */}
          {activePinWaypoint && (
            <div className="absolute bottom-3 left-3 z-[400] max-w-[270px] bg-[#FAF7F0]/95 backdrop-blur-xs border border-[#A4834C]/55 p-3.5 shadow-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-[#A4834C] font-semibold">
                  {getArea(activePinWaypoint)}
                  {activePinWaypoint.elevation ? ` · ${activePinWaypoint.elevation}` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setActivePinId(null)}
                  aria-label={t.actions.closeModal}
                  className="text-[#4F6047] hover:text-[#1B3128] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-serif text-base font-semibold text-[#1B3128] leading-snug">
                {getLabel(activePinWaypoint)}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    startVisitNavigation(activePinWaypoint.id, { originId, travelMode });
                    setActivePinId(null);
                  }}
                  className="px-2.5 py-1 bg-[#A4834C] text-[#FAF7F0] text-[11px] font-medium rounded-sm cursor-pointer inline-flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{t.actions.visitPlace}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestId(activePinWaypoint.id);
                    setActivePinId(null);
                  }}
                  className="px-2.5 py-1 bg-[#1B3128] text-[#FAF7F0] text-[11px] rounded-sm cursor-pointer"
                >
                  {t.actions.navigateHere}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOriginId(activePinWaypoint.id);
                    setActivePinId(null);
                  }}
                  className="px-2.5 py-1 border border-[#D9CCB8] text-[#1B3128] text-[11px] rounded-sm cursor-pointer"
                >
                  {t.navigationMap.originLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
