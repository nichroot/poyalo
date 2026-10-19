import SunCalc from 'suncalc';
import { ItineraryStop, RealityCheckFlag, RealityCheckResult } from '../types/itinerary';

// Haversine distance in kilometers
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2 || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return 1.5; // Reasonable default urban distance
  }
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert "HH:MM" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 600;
  const [h, m] = timeStr.split(':').map(Number);
  return (isNaN(h) ? 10 : h) * 60 + (isNaN(m) ? 0 : m);
}

// Convert minutes to "HH:MM"
export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function auditItinerary(
  stops: ItineraryStop[],
  tripDateStr: string = '2026-10-16'
): RealityCheckResult {
  const flags: RealityCheckFlag[] = [];
  const tripDate = new Date(tripDateStr);

  // Dynamic Golden hour calculation via SunCalc for destination's actual GPS coordinates
  const refLat = stops.find(s => s.lat && !isNaN(s.lat))?.lat ?? 35.6762;
  const refLng = stops.find(s => s.lng && !isNaN(s.lng))?.lng ?? 139.6503;
  
  let goldenHourStr = '18:15';
  let goldenHourMinutes = 18 * 60 + 15;
  try {
    const sunTimes = SunCalc.getTimes(tripDate, refLat, refLng);
    if (sunTimes && sunTimes.goldenHour && !isNaN(sunTimes.goldenHour.getTime())) {
      goldenHourMinutes = sunTimes.goldenHour.getHours() * 60 + sunTimes.goldenHour.getMinutes();
      goldenHourStr = minutesToTime(goldenHourMinutes);
    }
  } catch {
    // Fall back to default
  }

  let deduction = 0;

  stops.forEach((stop, idx) => {
    const stopStartMin = timeToMinutes(stop.startTime);
    const stopEndMin = timeToMinutes(stop.endTime);

    // 1. CHECK REASONABLE OPERATING HOURS BY CATEGORY
    const isMuseum = stop.category === 'museum';
    const isViewpoint = stop.category === 'viewpoint';
    const isFood = stop.category === 'food';
    const isHeritage = stop.category === 'heritage';

    const openTime = isMuseum ? '09:00' : isFood ? '11:00' : '08:30';
    const closeTime = isMuseum ? '18:00' : isViewpoint ? '23:30' : isFood ? '23:00' : '21:00';
    const openMin = timeToMinutes(openTime);
    const closeMin = timeToMinutes(closeTime);

    if (stopStartMin < openMin - 30) {
      deduction += 10;
      flags.push({
        id: `flag-early-${stop.id}`,
        type: 'CLOSED_VENUE',
        severity: 'warning',
        stopId: stop.id,
        stopName: stop.name,
        title: 'Early Arrival Before Opening Hours',
        message: `${stop.name} is scheduled at ${stop.startTime}, but typical morning opening is ${openTime}.`,
        roastComment: 'Showing up before the staff have even unlocked the gates? Pack patience or a coffee cup.',
        fixSuggestion: `Adjust start time to arrive after ${openTime}.`
      });
    } else if (stopEndMin > closeMin + 30) {
      deduction += 15;
      flags.push({
        id: `flag-late-${stop.id}`,
        type: 'CLOSED_VENUE',
        severity: 'error',
        stopId: stop.id,
        stopName: stop.name,
        title: 'Arrival After Closing Time',
        message: `${stop.name} is scheduled until ${stop.endTime}, but doors usually close by ${closeTime}.`,
        roastComment: 'Unless you have night-watchman credentials, you will be locked out.',
        fixSuggestion: `Schedule this visit between ${openTime} and ${closeTime}.`
      });
    }

    // 2. TRANSIT PHYSICS AUDIT (consecutive stops)
    if (idx < stops.length - 1) {
      const nextStop = stops[idx + 1];
      const distKm = calculateHaversineDistance(stop.lat, stop.lng, nextStop.lat, nextStop.lng);
      const nextStartMin = timeToMinutes(nextStop.startTime);
      const availableTransitMinutes = nextStartMin - stopEndMin;

      if (availableTransitMinutes < 0) {
        deduction += 20;
        flags.push({
          id: `flag-overlap-${stop.id}`,
          type: 'TRANSIT_SPEED',
          severity: 'error',
          stopId: stop.id,
          stopName: stop.name,
          title: 'Schedule Overlap Detected',
          message: `${stop.name} ends at ${stop.endTime}, which overlaps with next stop ${nextStop.name} starting at ${nextStop.startTime}.`,
          roastComment: 'Humans cannot exist in two places simultaneously — yet.',
          fixSuggestion: 'Add at least 20 minutes between consecutive stops.'
        });
      } else if (availableTransitMinutes === 0) {
        deduction += 12;
        flags.push({
          id: `flag-teleport-${stop.id}`,
          type: 'TRANSIT_SPEED',
          severity: 'warning',
          stopId: stop.id,
          stopName: stop.name,
          title: 'Zero Transit Buffer',
          message: `0 minutes buffer between leaving ${stop.name} and starting ${nextStop.name} (${distKm.toFixed(1)} km apart).`,
          roastComment: 'Instant teleportation is not yet offered by local transit authorities.',
          fixSuggestion: `Add ${Math.max(15, Math.ceil(distKm * 3))} minutes travel buffer.`
        });
      } else if (distKm > 3 && availableTransitMinutes < 15) {
        deduction += 10;
        flags.push({
          id: `flag-rush-${stop.id}`,
          type: 'TRANSIT_SPEED',
          severity: 'warning',
          stopId: stop.id,
          stopName: stop.name,
          title: `Tight Transit Window (${distKm.toFixed(1)} km in ${availableTransitMinutes}m)`,
          message: `Dense city traffic may cause delays between ${stop.name} and ${nextStop.name}.`,
          roastComment: 'Running through subway corridors with suitcases is nobody’s idea of a holiday.',
          fixSuggestion: `Increase buffer to ${Math.max(20, Math.ceil(distKm * 2.5))} minutes.`
        });
      }
    }

    // 3. SUNSET / GOLDEN HOUR ALIGNMENT
    if (stop.idealForSunset) {
      const diffFromGoldenHour = Math.abs(stopStartMin - goldenHourMinutes);
      if (diffFromGoldenHour <= 75) {
        // Optimal alignment — bonus points
        deduction = Math.max(0, deduction - 5);
      } else if (diffFromGoldenHour > 150) {
        deduction += 8;
        flags.push({
          id: `flag-sunset-${stop.id}`,
          type: 'GOLDEN_HOUR_MISSED',
          severity: 'warning',
          stopId: stop.id,
          stopName: stop.name,
          title: 'Scenic Viewpoint Outside Sunset Window',
          message: `${stop.name} is scheduled at ${stop.startTime}, while golden sunset is around ${goldenHourStr}.`,
          roastComment: 'Visiting an iconic panoramic viewpoint at high noon means harsh lighting and maximum squinting.',
          fixSuggestion: `Move this stop towards ${goldenHourStr} for peak golden-hour photography.`
        });
      }
    }

    // 4. MIDDAY HEAT / SUN EXPOSURE FOR OUTDOOR STOPS
    if (stop.isOutdoor && stopStartMin >= 12 * 60 + 30 && stopStartMin <= 15 * 60) {
      flags.push({
        id: `flag-heat-${stop.id}`,
        type: 'WEATHER_CLASH',
        severity: 'warning',
        stopId: stop.id,
        stopName: stop.name,
        title: 'Midday Sun Exposure',
        message: `${stop.name} is an outdoor activity scheduled during peak UV afternoon hours.`,
        roastComment: 'Peak midday sun is when locals head for shade, air conditioning, and iced drinks.',
        fixSuggestion: 'Carry hydration, sunscreen, or shift outdoor walks to morning or late afternoon.'
      });
    }
  });

  const finalScore = Math.max(20, Math.min(100, 100 - deduction));
  const status: RealityCheckResult['status'] = 
    finalScore >= 80 ? 'approved' : finalScore >= 60 ? 'caution' : 'critical';

  let roastVerdict = '';
  let professorVerdict = '';

  if (finalScore >= 85) {
    roastVerdict = "Miracle of miracles. Your itinerary obeys the laws of physics, daylight hours, and human legs. You might actually enjoy this trip!";
    professorVerdict = "Itinerary validated. Temporal spacing, daylight alignment, and transit proximity conform to optimal travel efficiency.";
  } else if (finalScore >= 65) {
    roastVerdict = "You are cutting a few connections tight. A brisk walk and a couple of espresso shots should pull you through.";
    professorVerdict = "Moderate friction detected. Minor transit congestion and venue windows warrant modest buffer adjustments.";
  } else {
    roastVerdict = "Time warp alert! This itinerary requires teleportation and ignoring opening doors. Add travel buffers before booking tickets!";
    professorVerdict = "Multiple deterministic constraints exceeded: overlapping time windows and inadequate transit buffers.";
  }

  return {
    score: finalScore,
    status,
    flags,
    roastVerdict,
    professorVerdict,
    goldenHourTime: goldenHourStr,
    isMurphyActive: false
  };
}
