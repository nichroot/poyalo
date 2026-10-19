export interface POI {
  id: string;
  name: string;
  city: string;
  category: 'heritage' | 'viewpoint' | 'souk' | 'food' | 'beach' | 'museum';
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  closedDays: number[]; // 0=Sunday, 1=Monday, 5=Friday, 6=Saturday
  lat: number;
  lng: number;
  isOutdoor: boolean;
  idealForSunset?: boolean;
  durationMinutes: number;
  description: string;
  entryCostAED: number;
}

export interface ItineraryStop {
  id: string;
  poiId: string;
  name: string;
  category: POI['category'];
  startTime: string; // "14:30"
  endTime: string; // "16:00"
  durationMinutes: number;
  lat: number;
  lng: number;
  isOutdoor: boolean;
  idealForSunset?: boolean;
  notes?: string;
  travelTimeMinutesToNext?: number;
  transitSpeedKmHToNext?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  stops: ItineraryStop[];
}

export type FlagSeverity = 'error' | 'warning' | 'info';

export type FlagType = 
  | 'CLOSED_VENUE' 
  | 'TRANSIT_SPEED' 
  | 'WEATHER_CLASH' 
  | 'GOLDEN_HOUR_MISSED' 
  | 'PASSPORT_EXPIRY' 
  | 'MEAL_SKIPPED'
  | 'ENTRY_VISA_ALERT';

export interface RealityCheckFlag {
  id: string;
  type: FlagType;
  severity: FlagSeverity;
  stopId?: string;
  stopName?: string;
  title: string;
  message: string;
  roastComment: string;
  fixSuggestion: string;
}

export interface RealityCheckResult {
  score: number; // 0 to 100
  status: 'critical' | 'caution' | 'approved';
  flags: RealityCheckFlag[];
  roastVerdict: string;
  professorVerdict: string;
  goldenHourTime: string; // e.g. "18:15"
  sunsetViewpointId?: string;
  isMurphyActive?: boolean;
  activeDisruption?: string;
}

export interface PassportCheckInput {
  nationality: string;
  passportExpiryDate: string; // YYYY-MM-DD
  tripStartDate: string; // YYYY-MM-DD
  destinationCountry: string; // "United Arab Emirates"
}

export interface PassportCheckResult {
  valid: boolean;
  daysRemaining: number;
  sixMonthsRulePassed: boolean;
  visaStatus: 'Visa-Free' | 'Visa on Arrival (30 Days)' | 'eVisa Required' | 'Pre-Arranged Visa';
  message: string;
  badgeColor: string;
}
