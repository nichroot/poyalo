declare const process: any;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'AIzaSyCU2Ua9831saitk0Ifc0877IpTvU3wYaao';
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt is required' });
  }

  try {
    const systemPrompt = `You are an expert travel planner for POYALO.
The traveler requested: "${prompt}".
Identify the destination city, country, and duration requested (e.g. "3 days in Tokyo" -> 3 days, "weekend" -> 2 days, or if unspecified default to 2 to 3 days). Maximum 5 days.

Return ONLY a valid JSON object matching this schema:
{
  "city": "Name of City",
  "country": "Name of Country",
  "theme": "Overall Trip Title (e.g. Tokyo Culture & Tech Adventure)",
  "totalDays": 2,
  "days": [
    {
      "dayNumber": 1,
      "theme": "Day 1 Theme (e.g. Historic Temples & Street Food)",
      "stops": [
        {
          "name": "Attraction Name",
          "category": "heritage" | "souk" | "museum" | "food" | "viewpoint",
          "startTime": "HH:MM (24-hour format)",
          "endTime": "HH:MM (24-hour format)",
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

Ensure coordinates (lat, lng) are real and accurate for the location. Sequence stops logically.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: 'POYALO AI upstream error', details: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: 'Plan generation failed', message: err.message });
  }
}
