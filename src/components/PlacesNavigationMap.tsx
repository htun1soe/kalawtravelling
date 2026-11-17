import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Bike,
  Car,
  Compass,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Route as RouteIcon,
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

interface RouteStepInfo {
  instruction: string;
  distanceLabel: string;
}

interface ComputedRouteSummary {
  distanceText: string;
  durationText: string;
  steps: RouteStepInfo[];
  usedFallbackMode: boolean;
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

function formatDurationMillis(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '—';
  const totalMinutes = Math.max(1, Math.round(ms / 60000));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

function isQuotaError(err: unknown): boolean {
  const msg =
    typeof err === 'string'
      ? err
      : err instanceof Error
        ? err.message
        : JSON.stringify(err ?? '');
  return (
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('429')
  );
}

interface RouteControllerProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  travelMode: TravelModeKey;
  onSummaryChange: (summary: ComputedRouteSummary | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string | null) => void;
  routeErrorMessage: string;
}

interface MapPolyline {
  setMap: (map: unknown) => void;
}

const RouteController: React.FC<RouteControllerProps> = ({
  origin,
  destination,
  travelMode,
  onSummaryChange,
  onLoadingChange,
  onErrorChange,
  routeErrorMessage,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<MapPolyline[]>([]);

  const clearPolylines = useCallback(() => {
    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearPolylines();
    };
  }, [clearPolylines]);

  useEffect(() => {
    if (!map || !routesLib || !origin || !destination) return;
    if (
      Math.abs(origin.lat - destination.lat) < 0.0001 &&
      Math.abs(origin.lng - destination.lng) < 0.0001
    ) {
      clearPolylines();
      onSummaryChange({
        distanceText: '0 m',
        durationText: '1 min',
        steps: [],
        usedFallbackMode: false,
      });
      onErrorChange(null);
      return;
    }

    let cancelled = false;
    onLoadingChange(true);
    onErrorChange(null);

    const runCompute = async (modeToUse: TravelModeKey, isFallback: boolean) => {
      try {
        const RouteClass = (routesLib as unknown as {
          Route: {
            computeRoutes: (req: Record<string, unknown>) => Promise<{
              routes?: Array<{
                distanceMeters?: number;
                durationMillis?: number;
                viewport?: unknown;
                legs?: Array<{
                  steps?: Array<{
                    distanceMeters?: number;
                    navigationInstruction?: { instructions?: string };
                  }>;
                }>;
                createPolylines: (opts?: Record<string, unknown>) => MapPolyline[];
              }>;
            }>;
          };
        }).Route;

        const { routes } = await RouteClass.computeRoutes({
          origin,
          destination,
          travelMode: modeToUse,
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
        });

        if (cancelled) return;
        const primaryRoute = routes?.[0];
        if (!primaryRoute) {
          if (modeToUse === 'TWO_WHEELER' && !isFallback) {
            await runCompute('DRIVING', true);
            return;
          }
          clearPolylines();
          onSummaryChange(null);
          onErrorChange(routeErrorMessage);
          onLoadingChange(false);
          return;
        }

        clearPolylines();
        const createdPolylines = primaryRoute.createPolylines({
          strokeColor: '#1B3128',
          strokeOpacity: 0.9,
          strokeWeight: 5,
        });
        createdPolylines.forEach((line) => line.setMap(map));
        polylinesRef.current = createdPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const rawSteps = primaryRoute.legs?.[0]?.steps || [];
        const steps: RouteStepInfo[] = rawSteps
          .map((step) => ({
            instruction: (step.navigationInstruction?.instructions || '').trim(),
            distanceLabel: formatDistanceMeters(step.distanceMeters || 0),
          }))
          .filter((s) => s.instruction.length > 0);

        onSummaryChange({
          distanceText: formatDistanceMeters(primaryRoute.distanceMeters || 0),
          durationText: formatDurationMillis(primaryRoute.durationMillis || 0),
          steps,
          usedFallbackMode: isFallback,
        });
        onLoadingChange(false);
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (modeToUse === 'TWO_WHEELER' && !isFallback && !isQuotaError(err)) {
          await runCompute('DRIVING', true);
          return;
        }
        clearPolylines();
        onSummaryChange(null);
        onErrorChange(routeErrorMessage);
        onLoadingChange(false);
      }
    };

    runCompute(travelMode, false);

    return () => {
      cancelled = true;
    };
  }, [
    map,
    routesLib,
    origin,
    destination,
    travelMode,
    clearPolylines,
    onSummaryChange,
    onLoadingChange,
    onErrorChange,
    routeErrorMessage,
  ]);

  return null;
};

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
    mapsApiKey,
  } = useApp();

  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all');
  const [originId, setOriginId] = useState<string>('hub-clock-tower');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [destId, setDestId] = useState<string>(initialDestinationId);
  const [travelMode, setTravelMode] = useState<TravelModeKey>('DRIVING');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const [routeSummary, setRouteSummary] = useState<ComputedRouteSummary | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

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
      return KALAW_WAYPOINTS.filter((w) => w.kind === 'destination' || w.kind === 'stay' || w.kind === 'restaurant' || w.id === destId);
    }
    return KALAW_WAYPOINTS.filter((w) => w.goalBucket === goalFilter || w.id === destId);
  }, [goalFilter, destId]);

  const originWaypoint = originId === 'gps' ? null : getWaypointById(originId) || KALAW_WAYPOINTS[0];
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

  const goalButtons: Array<{ key: GoalFilter; label: string }> = [
    { key: 'all', label: t.navigationMap.goals.all },
    { key: 'sunrise', label: t.navigationMap.goals.sunrise },
    { key: 'trekking', label: t.navigationMap.goals.trekking },
    { key: 'heritage', label: t.navigationMap.goals.heritage },
    { key: 'staysDining', label: t.navigationMap.goals.staysDining },
  ];

  const travelModeButtons: Array<{ key: TravelModeKey; label: string; icon: React.ReactNode }> = [
    { key: 'WALKING', label: t.navigationMap.modes.WALKING, icon: <Footprints className="w-3.5 h-3.5" /> },
    { key: 'TWO_WHEELER', label: t.navigationMap.modes.TWO_WHEELER, icon: <Bike className="w-3.5 h-3.5" /> },
    { key: 'DRIVING', label: t.navigationMap.modes.DRIVING, icon: <Car className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      id="places-navigator"
      className={`bg-[#FAF7F0] luxury-frame ${compact ? 'p-4 md:p-5 space-y-4' : 'p-6 md:p-8 space-y-6'}`}
    >
      {/* Header & Goal Presets */}
      {!compact && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#A4834C]/25 pb-5">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A4834C] font-medium flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.navigationMap.eyebrow}</span>
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B3128]">
              {t.navigationMap.title}
            </h2>
            <p className="text-sm text-[#222420]/75 leading-relaxed">
              {t.navigationMap.subtitle}
            </p>
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
      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} gap-6 items-start`}>
        {/* Controls & Turn-by-Turn Panel */}
        <div className={`${compact ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-4 bg-[#F6F2E9] border border-[#D9CCB8] p-4 md:p-5`}>
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
                <span>{locatingGps ? t.navigationMap.locatingGps : t.navigationMap.useCurrentLocation}</span>
              </button>
            </div>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              aria-label={t.navigationMap.originLabel}
              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
            >
              {gpsCoords && (
                <option value="gps">{t.navigationMap.gpsOriginLabel}</option>
              )}
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
                {KALAW_WAYPOINTS.filter((w) => w.kind === 'stay' || w.kind === 'restaurant').map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {getLabel(wp)}
                  </option>
                ))}
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
                  <span className="truncate">{m.label}</span>
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

          {routeSummary?.usedFallbackMode && (
            <p className="text-[11px] text-[#A4834C]">
              {t.navigationMap.twoWheelerFallbackNote}
            </p>
          )}

          {routeError && (
            <p className="text-xs text-[#B66F52] bg-[#B66F52]/10 border border-[#B66F52]/30 p-2.5">
              {routeError}
            </p>
          )}

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
          {destWaypoint.kind !== 'hub' && (
            <div className="pt-2 flex flex-wrap gap-2 border-t border-[#D9CCB8]">
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

        {/* Interactive Google Map Canvas */}
        <div
          className={`${compact ? 'lg:col-span-7 h-[300px] lg:h-[360px]' : 'lg:col-span-8 h-[440px] lg:h-[540px]'} w-full border border-[#A4834C]/35 bg-[#EBE5D8] relative overflow-hidden`}
        >
          {mapsApiKey ? (
            <GoogleMap
              defaultCenter={KALAW_CENTER}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              className="w-full h-full"
            >
              <RouteController
                origin={originLatLng}
                destination={destLatLng}
                travelMode={travelMode}
                onSummaryChange={setRouteSummary}
                onLoadingChange={setRouteLoading}
                onErrorChange={setRouteError}
                routeErrorMessage={t.navigationMap.routeError}
              />

              {originId === 'gps' && gpsCoords && (
                <AdvancedMarker position={gpsCoords} title={t.navigationMap.gpsOriginLabel}>
                  <Pin background="#4F6047" borderColor="#FAF7F0" glyphColor="#FAF7F0" />
                </AdvancedMarker>
              )}

              {visibleWaypoints.map((wp) => {
                const isDest = wp.id === destId;
                const isOrigin = wp.id === originId;
                const bg = isDest ? '#A4834C' : isOrigin ? '#1B3128' : '#243D32';
                const border = isDest ? '#1B3128' : '#FAF7F0';
                return (
                  <AdvancedMarker
                    key={wp.id}
                    position={{ lat: wp.lat, lng: wp.lng }}
                    title={getLabel(wp)}
                    onClick={() => setActivePinId(wp.id)}
                  >
                    <Pin background={bg} borderColor={border} glyphColor="#FAF7F0" scale={isDest ? 1.15 : 0.95} />
                  </AdvancedMarker>
                );
              })}

              {activePinWaypoint && (
                <InfoWindow
                  position={{ lat: activePinWaypoint.lat, lng: activePinWaypoint.lng }}
                  onCloseClick={() => setActivePinId(null)}
                >
                  <div className="p-1 max-w-[230px] text-[#222420] space-y-1.5">
                    <p className="text-[11px] uppercase tracking-wider text-[#A4834C] font-semibold">
                      {getArea(activePinWaypoint)}
                      {activePinWaypoint.elevation ? ` · ${activePinWaypoint.elevation}` : ''}
                    </p>
                    <p className="font-serif text-base font-semibold text-[#1B3128] leading-snug">
                      {getLabel(activePinWaypoint)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDestId(activePinWaypoint.id);
                          setActivePinId(null);
                        }}
                        className="px-2 py-1 bg-[#1B3128] text-[#FAF7F0] text-[11px] rounded-sm cursor-pointer"
                      >
                        {t.actions.navigateHere}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOriginId(activePinWaypoint.id);
                          setActivePinId(null);
                        }}
                        className="px-2 py-1 border border-[#D9CCB8] text-[#1B3128] text-[11px] rounded-sm cursor-pointer"
                      >
                        {t.navigationMap.originLabel}
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#1B3128]/5">
              <MapPin className="w-8 h-8 text-[#A4834C]" />
              <p className="font-serif text-xl text-[#1B3128]">{getLabel(destWaypoint)}</p>
              <p className="text-xs text-[#4F6047] max-w-md">{t.navigationMap.missingKeyNotice}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
