declare const process: any;

interface GeneratedMythItem {
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

function generateFallbackMyths(destinationName: string): GeneratedMythItem[] {
  const city = destinationName.trim() || 'Worldwide Destination';
  return [
    {
      id: `myth-fb-${Date.now()}-1`,
      city,
      country: 'Travel Reality',
      category: 'humans',
      categoryLabel: 'Street & Social Etiquette',
      emoji: '🤝',
      myth: `Locals in ${city} are distant or unwelcoming to foreign tourists.`,
      reality: `Locals deeply value politeness, personal space, and humble greetings. A simple attempt at a local greeting breaks all ice.`,
      insiderTip: `Learn 3 words in the native language ("Please", "Thank You", "Excuse Me") — it unlocks genuine warmth instantly.`,
      severity: 'fun'
    },
    {
      id: `myth-fb-${Date.now()}-2`,
      city,
      country: 'Travel Reality',
      category: 'food',
      categoryLabel: 'Culinary Traditions',
      emoji: '🍲',
      myth: `Authentic traditional meals can only be found in upscale fine-dining establishments.`,
      reality: `The most authentic, generational recipes are served at family-run alleyway eateries and buzzing market stalls.`,
      insiderTip: `Look for places packed with local elders or workers at lunch — the food turnover is fast and flavor unbeatable.`,
      severity: 'fun'
    },
    {
      id: `myth-fb-${Date.now()}-3`,
      city,
      country: 'Travel Reality',
      category: 'monuments',
      categoryLabel: 'Famous Landmarks',
      emoji: '🏛️',
      myth: `You can easily buy tickets at the entrance gate for top attractions on the day of your visit.`,
      reality: `Most world-renowned landmarks enforce strict timed-entry slots that sell out days or weeks in advance.`,
      insiderTip: `Always book direct official entry tickets online 1-2 weeks before arrival, and arrive 15 minutes before your time slot.`,
      severity: 'high'
    },
    {
      id: `myth-fb-${Date.now()}-4`,
      city,
      country: 'Travel Reality',
      category: 'safety',
      categoryLabel: 'Transit & Local Laws',
      emoji: '🚇',
      myth: `Taxis are always the fastest and cheapest way to get around ${city}.`,
      reality: `Heavy peak traffic and surge pricing make public metro, trams, or walking dramatically faster and more enjoyable.`,
      insiderTip: `Get a rechargeable local transit card or tap-to-pay transit pass on day 1 for seamless navigation.`,
      severity: 'medium'
    }
  ];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destinationName } = req.body || {};
  if (!destinationName || typeof destinationName !== 'string') {
    return res.status(400).json({ error: 'destinationName is required' });
  }

  const apiKey = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || req.body?.apiKey || '';

  if (apiKey && apiKey.length > 10) {
    try {
      const prompt = `You are a cultural myth-buster and local etiquette expert for POYALO travel app.
The traveler has booked or is planning a trip to: "${destinationName}".
Identify the most prevalent myths, misconceptions, tourist stereotypes, and cultural traps related to:
1. The local people & social etiquette (e.g. tipping rules, greetings, personal space, gestures)
2. Famous monuments & attractions (e.g. ticket booking traps, best times, dress codes)
3. Food, dining, and drinking traditions (e.g. genuine local dishes vs tourist fake dishes, dining customs)
4. Transit, safety, and local laws (e.g. scams, metro rules, unexpected local regulations)

CRITICAL INSTRUCTION: Be extremely specific to "${destinationName}". Use real names of neighborhoods, dishes, laws, transit cards, or cultural habits. Do NOT give generic travel advice.

Return ONLY a valid JSON array of 4 distinct myth objects matching this schema:
[
  {
    "category": "humans" | "monuments" | "food" | "traditional" | "safety",
    "categoryLabel": "Specific Category Title",
    "emoji": "Single emoji",
    "myth": "The common false belief or tourist assumption (1-2 sentences)",
    "reality": "The authentic local reality (2 sentences)",
    "insiderTip": "Actionable insider advice (1-2 sentences)",
    "severity": "high" | "medium" | "fun"
  }
]`;

      const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash'];
      let parsedMyths: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.6
                }
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
              const cleanText = textContent.replace(/```json\s*|```/g, '').trim();
              const rawJson = JSON.parse(cleanText);
              const items = Array.isArray(rawJson) ? rawJson : rawJson.myths || [];
              if (items.length > 0) {
                parsedMyths = items;
                break;
              }
            }
          } else {
            const err = await response.text();
            console.warn(`[POYALO API Myths] Model ${model} returned ${response.status}:`, err.slice(0, 200));
          }
        } catch (mErr: any) {
          console.warn(`[POYALO API Myths] Error calling ${model}:`, mErr?.message);
        }
      }

      if (parsedMyths) {
        const formattedMyths: GeneratedMythItem[] = parsedMyths.map((m: any, idx: number) => ({
          id: `ai-myth-${Date.now()}-${idx}`,
          city: destinationName,
          country: m.country || 'Destination',
          category: (['humans', 'monuments', 'food', 'traditional', 'safety'].includes(m.category) ? m.category : 'traditional') as any,
          categoryLabel: m.categoryLabel || 'Cultural Lore',
          emoji: m.emoji || '💡',
          myth: m.myth || 'Common tourist assumption.',
          reality: m.reality || 'Authentic local reality.',
          insiderTip: m.insiderTip || 'Be respectful and ask locals politely.',
          severity: (['high', 'medium', 'fun'].includes(m.severity?.toLowerCase()) ? m.severity.toLowerCase() : 'fun') as any
        }));
        return res.status(200).json(formattedMyths);
      }
    } catch (err: any) {
      console.error('[POYALO API Myths] Live generation error:', err?.message);
    }
  }

  // Guaranteed fallback myths
  const fallback = generateFallbackMyths(destinationName);
  return res.status(200).json(fallback);
}
