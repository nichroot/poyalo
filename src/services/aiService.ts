import { ItineraryStop, ItineraryDay } from '../types/itinerary';
import { ComicStory, ComicTone, EraLayer } from '../types/comic';

const GEMINI_API_KEY: string = 
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  'AIzaSyCU2Ua9831saitk0Ifc0877IpTvU3wYaao';

export interface GeneratedPlanResponse {
  city: string;
  country: string;
  theme: string;
  totalDays: number;
  days: ItineraryDay[];
  stops: ItineraryStop[];
}

export async function generateAIPlan(userPrompt: string): Promise<GeneratedPlanResponse> {
  // 1. Try Vercel / serverless endpoint first
  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt })
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.days?.length > 0 || data?.stops?.length > 0) {
        // Normalize serverless response
        const totalDays = data.totalDays || (data.days?.length) || 1;
        const normalizedDays: ItineraryDay[] = (data.days && data.days.length > 0) 
          ? data.days.map((d: any, dIdx: number) => ({
              dayNumber: d.dayNumber || dIdx + 1,
              theme: d.theme || `Day ${dIdx + 1} Exploration`,
              stops: (d.stops || []).map((s: any, idx: number) => ({
                id: `ai-stop-${dIdx + 1}-${Date.now()}-${idx}`,
                poiId: `poi-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: s.name,
                category: s.category || 'heritage',
                startTime: s.startTime || '10:00',
                endTime: s.endTime || '11:30',
                durationMinutes: Number(s.durationMinutes) || 75,
                lat: Number(s.lat) || 0,
                lng: Number(s.lng) || 0,
                isOutdoor: Boolean(s.isOutdoor),
                idealForSunset: Boolean(s.idealForSunset),
                notes: s.notes || undefined
              }))
            }))
          : [
              {
                dayNumber: 1,
                theme: data.theme || 'Day 1 Highlights',
                stops: data.stops || []
              }
            ];

        return {
          city: data.city || 'Custom Destination',
          country: data.country || 'Worldwide',
          theme: data.theme || 'Curated Exploration Trail',
          totalDays: totalDays,
          days: normalizedDays,
          stops: normalizedDays[0]?.stops || []
        };
      }
    }
  } catch {
    // Fall back to direct POYALO AI call
  }

  // 2. Direct POYALO AI API Call
  const systemPrompt = `You are a world-class travel planner for the POYALO app.
The user wants an itinerary for: "${userPrompt}".
Detect the destination city, country, and how many days they requested (e.g. "3 days in Tokyo" -> 3 days, "weekend in Rome" -> 2 days, or if unspecified default to 2 or 3 days). Maximum 5 days. For each day, create 3 to 4 distinct logically sequenced stops.

Return ONLY a valid JSON object matching this exact schema:
{
  "city": "Name of City",
  "country": "Name of Country",
  "theme": "Overall Trip Title (e.g. Tokyo Culture & Tech Adventure)",
  "totalDays": 2,
  "days": [
    {
      "dayNumber": 1,
      "theme": "Catchy theme for Day 1",
      "stops": [
        {
          "name": "Attraction Name",
          "category": "heritage" | "souk" | "museum" | "food" | "viewpoint",
          "startTime": "HH:MM (24h format)",
          "endTime": "HH:MM (24h format)",
          "durationMinutes": 60,
          "lat": 35.6895,
          "lng": 139.6917,
          "isOutdoor": true,
          "idealForSunset": false,
          "notes": "Short highlight or insider tip"
        }
      ]
    }
  ]
}

Ensure:
- Real geographic coordinates (lat, lng) for each stop so the travel physics engine works accurately.
- Logically sequenced times throughout each day (e.g. 09:30 to 18:30).
- If one stop is a scenic sunset or lookout point, set "idealForSunset": true and schedule it in the late afternoon.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`POYALO AI API returned ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error('No content returned from AI');
  }

  const parsed = JSON.parse(textContent);

  // Normalize days
  const normalizedDays: ItineraryDay[] = (parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0)
    ? parsed.days.map((d: any, dIdx: number) => ({
        dayNumber: d.dayNumber || dIdx + 1,
        theme: d.theme || `Day ${dIdx + 1} Trail`,
        stops: (d.stops || []).map((s: any, idx: number) => ({
          id: `ai-stop-d${dIdx + 1}-${Date.now()}-${idx}`,
          poiId: `poi-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: s.name,
          category: s.category || 'heritage',
          startTime: s.startTime || '10:00',
          endTime: s.endTime || '11:30',
          durationMinutes: Number(s.durationMinutes) || 75,
          lat: Number(s.lat) || 0,
          lng: Number(s.lng) || 0,
          isOutdoor: Boolean(s.isOutdoor),
          idealForSunset: Boolean(s.idealForSunset),
          notes: s.notes || undefined
        }))
      }))
    : [
        {
          dayNumber: 1,
          theme: parsed.theme || 'Day 1 Highlights',
          stops: (parsed.stops || []).map((s: any, idx: number) => ({
            id: `ai-stop-${Date.now()}-${idx}`,
            poiId: `poi-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: s.name,
            category: s.category || 'heritage',
            startTime: s.startTime || '10:00',
            endTime: s.endTime || '11:30',
            durationMinutes: Number(s.durationMinutes) || 75,
            lat: Number(s.lat) || 0,
            lng: Number(s.lng) || 0,
            isOutdoor: Boolean(s.isOutdoor),
            idealForSunset: Boolean(s.idealForSunset),
            notes: s.notes || undefined
          }))
        }
      ];

  const totalDays = parsed.totalDays || normalizedDays.length;

  return {
    city: parsed.city || 'Custom Destination',
    country: parsed.country || 'Worldwide',
    theme: parsed.theme || 'Curated Exploration Trail',
    totalDays: totalDays,
    days: normalizedDays,
    stops: normalizedDays[0]?.stops || []
  };
}

export async function generateAIComicStory(
  placeOrCity: string,
  tone: ComicTone,
  era: EraLayer
): Promise<ComicStory> {
  const prompt = `Create a 3-panel comic story for "${placeOrCity}" in tone "${tone}" and era layer "${era}".
Follow the POYALO comic style with narrative caption, scenes, speech bubbles, sound effects, and sources.

Return a valid JSON object matching this schema:
{
  "title": "Comic Episode Title",
  "tagline": "Witty 1-sentence subtitle",
  "cityName": "${placeOrCity}",
  "panels": [
    {
      "panelNumber": 1,
      "narrativeCaption": "CAPTION IN CAPS",
      "panelScene": "Scene description",
      "illustrationEmoji": "🏛️",
      "illustrationBgColor": "#FEF3C7",
      "speechBubbles": [
        {
          "speaker": "Character Name",
          "avatarEmoji": "🤠",
          "text": "Dialogue line",
          "type": "speech" | "thought" | "shout",
          "pointerDirection": "bottom-left" | "bottom-right"
        }
      ],
      "soundEffect": {
        "text": "BOOM!",
        "color": "#FF5722",
        "rotationDeg": -6
      }
    }
  ],
  "sources": ["Source 1", "Source 2"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.8
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate comic story');
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(textContent);

  return {
    id: `ai-comic-${Date.now()}`,
    placeId: `poi-${placeOrCity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    placeName: placeOrCity,
    cityName: parsed.cityName || placeOrCity,
    eraLayer: era,
    tone: tone,
    title: parsed.title,
    tagline: parsed.tagline,
    panels: parsed.panels || [],
    sources: parsed.sources || ['Local Historical Archives']
  };
}

export interface GeneratedMythItem {
  id: string;
  city: string;
  country: string;
  category: 'humans' | 'monuments' | 'food' | 'traditional' | 'safety';
  categoryLabel: string;
  emoji: string;
  myth: string;
  reality: string;
  insiderTip: string;
  severity: 'high' | 'medium' | 'fun';
}

export async function generateAIMyths(destinationName: string): Promise<GeneratedMythItem[]> {
  const prompt = `You are a cultural myth-buster and local etiquette expert for POYALO travel app.
The traveler has booked or is planning a trip to: "${destinationName}".
Identify the most prevalent myths, misconceptions, tourist stereotypes, and cultural traps related to:
1. The local humans / people & their social etiquette
2. Famous monuments & attractions
3. Food, dining, and drinking traditions
4. Real tourist traps or safety realities

Return ONLY a valid JSON array of 4 distinct myth objects matching this schema:
[
  {
    "category": "humans" | "monuments" | "food" | "traditional" | "safety",
    "categoryLabel": "Short category title (e.g. People & Customs)",
    "emoji": "Single relevant emoji decal",
    "myth": "The common false belief or tourist misconception (1-2 sentences)",
    "reality": "The authentic local reality, historical fact, or cultural truth (2 sentences)",
    "insiderTip": "Actionable local etiquette advice or insider hack for visitors (1-2 sentences)",
    "severity": "high" | "medium" | "fun"
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate myths for ${destinationName}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) throw new Error('No myth data received from AI');

  const parsed = JSON.parse(textContent);
  const items = Array.isArray(parsed) ? parsed : parsed.myths || [];

  return items.map((m: any, idx: number) => ({
    id: `ai-myth-${Date.now()}-${idx}`,
    city: destinationName,
    country: m.country || 'Destination',
    category: m.category || 'traditional',
    categoryLabel: m.categoryLabel || 'Local Lore',
    emoji: m.emoji || '💡',
    myth: m.myth || 'Common tourist misconception.',
    reality: m.reality || 'The local authentic reality.',
    insiderTip: m.insiderTip || 'Be respectful and ask locals politely.',
    severity: m.severity || 'fun'
  }));
}
