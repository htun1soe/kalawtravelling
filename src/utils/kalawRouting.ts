import type { TravelModeKey } from '../context/AppContext';

export type ManeuverKind = 'straight' | 'left' | 'right' | 'uturn' | 'roundabout' | 'arrive';

export interface RouteStepInfo {
  instruction: string;
  distanceLabel: string;
  distanceMeters: number;
  maneuver: ManeuverKind;
  location: [number, number]; // [lat, lng]
  coordIndex: number;
}

export interface ComputedRouteResult {
  coordinates: Array<[number, number]>; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  distanceText: string;
  durationText: string;
  steps: RouteStepInfo[];
  isDirectEstimate: boolean;
}

export function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters) || meters <= 0) return '0 m';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDurationSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '1 min';
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function computeBearingDegrees(from: [number, number], to: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(from[0]);
  const lat2 = toRad(to[0]);
  const dLon = toRad(to[1] - from[1]);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function classifyManeuver(type?: string, modifier?: string): ManeuverKind {
  if (type === 'arrive') return 'arrive';
  if (type === 'roundabout' || type === 'rotary') return 'roundabout';
  const mod = (modifier || '').toLowerCase();
  if (mod.includes('uturn')) return 'uturn';
  if (mod.includes('left')) return 'left';
  if (mod.includes('right')) return 'right';
  return 'straight';
}

export function formatOsrmInstruction(step: {
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

export function findNearestCoordIndex(
  coords: Array<[number, number]>,
  target: [number, number]
): number {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < coords.length; i++) {
    const d = haversineMeters(
      { lat: coords[i][0], lng: coords[i][1] },
      { lat: target[0], lng: target[1] }
    );
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export async function fetchKalawRoute(params: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  travelMode: TravelModeKey;
  destLabel: string;
  destArea: string;
  signal?: AbortSignal;
}): Promise<ComputedRouteResult> {
  const { origin, destination, travelMode, destLabel, destArea, signal } = params;

  if (
    Math.abs(origin.lat - destination.lat) < 0.0001 &&
    Math.abs(origin.lng - destination.lng) < 0.0001
  ) {
    const point: [number, number] = [destination.lat, destination.lng];
    return {
      coordinates: [point, point],
      distanceMeters: 0,
      durationSeconds: 60,
      distanceText: '0 m',
      durationText: '1 min',
      steps: [
        {
          instruction: `Arrive at ${destLabel}`,
          distanceLabel: '0 m',
          distanceMeters: 0,
          maneuver: 'arrive',
          location: point,
          coordIndex: 0,
        },
      ],
      isDirectEstimate: false,
    };
  }

  const fossgisProfile =
    travelMode === 'WALKING'
      ? 'routed-foot'
      : travelMode === 'TWO_WHEELER'
        ? 'routed-bike'
        : 'routed-car';

  const coordsSegment = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://routing.openstreetmap.de/${fossgisProfile}/route/v1/driving/${coordsSegment}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('OSRM failed');

    const data = (await res.json()) as {
      routes?: Array<{
        distance?: number;
        duration?: number;
        geometry?: { coordinates?: Array<[number, number]> };
        legs?: Array<{
          steps?: Array<{
            distance?: number;
            name?: string;
            maneuver?: { type?: string; modifier?: string; location?: [number, number] };
          }>;
        }>;
      }>;
    };

    const primary = data.routes?.[0];
    const rawCoords = primary?.geometry?.coordinates;
    if (!primary || !rawCoords || rawCoords.length < 2) {
      throw new Error('Empty route geometry');
    }

    const coordinates: Array<[number, number]> = rawCoords.map(([lng, lat]) => [lat, lng]);
    const rawSteps = primary.legs?.[0]?.steps || [];
    const steps: RouteStepInfo[] = rawSteps
      .filter((s) => (s.distance || 0) > 10 || s.maneuver?.type === 'arrive')
      .map((s) => {
        const locLonLat = s.maneuver?.location;
        const loc: [number, number] = locLonLat
          ? [locLonLat[1], locLonLat[0]]
          : coordinates[0];
        const coordIndex = findNearestCoordIndex(coordinates, loc);
        const dist = s.distance || 0;
        return {
          instruction: formatOsrmInstruction(s),
          distanceLabel: formatDistanceMeters(dist),
          distanceMeters: dist,
          maneuver: classifyManeuver(s.maneuver?.type, s.maneuver?.modifier),
          location: loc,
          coordIndex,
        };
      });

    const rawDuration = primary.duration || 0;
    const distanceMeters = primary.distance || 0;
    const calibratedDuration =
      travelMode === 'TWO_WHEELER'
        ? Math.max(60, Math.round(rawDuration * 0.55))
        : travelMode === 'WALKING'
          ? Math.max(60, rawDuration || Math.round(distanceMeters / 1.2))
          : Math.max(60, rawDuration);

    return {
      coordinates,
      distanceMeters,
      durationSeconds: calibratedDuration,
      distanceText: formatDistanceMeters(distanceMeters),
      durationText: formatDurationSeconds(calibratedDuration),
      steps,
      isDirectEstimate: false,
    };
  } catch (err: unknown) {
    if (signal?.aborted || (err instanceof Error && err.name === 'AbortError')) {
      throw err;
    }

    // Interpolate 12 waypoints along the direct highland corridor for smooth step-by-step guidance fallback
    const interpCoords: Array<[number, number]> = [];
    const segments = 12;
    for (let i = 0; i <= segments; i++) {
      const f = i / segments;
      interpCoords.push([
        origin.lat + (destination.lat - origin.lat) * f,
        origin.lng + (destination.lng - origin.lng) * f,
      ]);
    }
    const straightMeters = haversineMeters(origin, destination);
    const estimatedRoadMeters = Math.round(straightMeters * 1.35);
    const speedMps =
      travelMode === 'WALKING' ? 1.15 : travelMode === 'TWO_WHEELER' ? 7.2 : 9.5;
    const estimatedSeconds = estimatedRoadMeters / speedMps;

    return {
      coordinates: interpCoords,
      distanceMeters: estimatedRoadMeters,
      durationSeconds: estimatedSeconds,
      distanceText: `~${formatDistanceMeters(estimatedRoadMeters)}`,
      durationText: `~${formatDurationSeconds(estimatedSeconds)}`,
      steps: [
        {
          instruction: `Head toward ${destLabel} (${destArea})`,
          distanceLabel: formatDistanceMeters(estimatedRoadMeters),
          distanceMeters: estimatedRoadMeters,
          maneuver: 'straight',
          location: [origin.lat, origin.lng],
          coordIndex: 0,
        },
        {
          instruction: `Arrive at ${destLabel}`,
          distanceLabel: '0 m',
          distanceMeters: 0,
          maneuver: 'arrive',
          location: [destination.lat, destination.lng],
          coordIndex: segments,
        },
      ],
      isDirectEstimate: true,
    };
  }
}
