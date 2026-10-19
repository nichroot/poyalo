declare const process: any;

interface ComicSpeechBubble {
  speaker: string;
  avatarEmoji?: string;
  text: string;
  type: 'speech' | 'thought' | 'shout';
  pointerDirection: 'bottom-left' | 'bottom-right' | 'top';
}

interface ComicSoundEffect {
  text: string;
  color: string;
  rotationDeg: number;
}

interface ComicPanel {
  panelNumber: number;
  narrativeCaption?: string;
  panelScene: string;
  illustrationEmoji: string;
  illustrationBgColor: string;
  speechBubbles: ComicSpeechBubble[];
  soundEffect?: ComicSoundEffect;
}

interface ComicStory {
  id: string;
  placeId: string;
  placeName: string;
  cityName: string;
  eraLayer: '1800s' | '1950s' | 'modern';
  tone: 'professor' | 'storyteller' | 'roast' | 'kid';
  title: string;
  tagline: string;
  panels: ComicPanel[];
  sources: string[];
}

function generateFallbackComic(placeOrCity: string, tone: string, era: string): ComicStory {
  const cleanName = placeOrCity.trim() || 'Historic Destination';
  const eraTitle = era === '1800s' ? '19th Century Origins' : era === '1950s' ? 'Mid-Century Rebirth' : 'Modern Metropolis';

  return {
    id: `comic-fb-${Date.now()}`,
    placeId: `poi-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    placeName: `${cleanName} Historic Quarter`,
    cityName: cleanName,
    eraLayer: (era as any) || 'modern',
    tone: (tone as any) || 'storyteller',
    title: `${cleanName}: ${eraTitle}`,
    tagline: `An illustrated adventure into the local history and hidden lore of ${cleanName}.`,
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: `ARRIVAL IN ${cleanName.toUpperCase()} • ${era === '1800s' ? '1880' : era === '1950s' ? '1955' : 'PRESENT DAY'}`,
        panelScene: `First glimpse of the bustling historic center of ${cleanName}.`,
        illustrationEmoji: '🏛️',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Local Guide',
            avatarEmoji: '🧭',
            text: `Welcome to ${cleanName}! Every cobblestone here holds centuries of travelers' secrets!`,
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Explorer',
            avatarEmoji: '🎒',
            text: `I've traveled across continents just to see this legendary quarter!`,
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'WELCOME!',
          color: '#1B3FFF',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: `THE CULTURAL DISCOVERY AT THE CENTRAL BAZAAR`,
        panelScene: `Sampling authentic delicacies and meeting local artisans.`,
        illustrationEmoji: '☕',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Master Artisan',
            avatarEmoji: '👨🏽‍🍳',
            text: `Taste this recipe! Our families have perfected this flavor for generations.`,
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Traveler',
            avatarEmoji: '😋',
            text: `Unbelievable! You could never find this anywhere outside ${cleanName}!`,
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CRUNCH!',
          color: '#F59E0B',
          rotationDeg: 8
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: `TWILIGHT MEMORIES & ENDURING LORE`,
        panelScene: `The golden hour lights reflect across the ancient streets as the day winds down.`,
        illustrationEmoji: '🌅',
        illustrationBgColor: '#FCE7F3',
        speechBubbles: [
          {
            speaker: 'Historian',
            avatarEmoji: '📜',
            text: `Those who understand the past of ${cleanName} carry its spirit wherever they roam.`,
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Explorer',
            avatarEmoji: '✨',
            text: `POYALO! The journey has only just begun!`,
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'POYALO!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: [`${cleanName} Historical Archives`, 'POYALO Global Storytelling Collective']
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeOrCity, tone = 'storyteller', era = 'modern' } = req.body || {};
  if (!placeOrCity || typeof placeOrCity !== 'string') {
    return res.status(400).json({ error: 'placeOrCity is required' });
  }

  const apiKey = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || req.body?.apiKey || '';

  if (apiKey && apiKey.length > 10) {
    try {
      const toneGuidance =
        tone === 'professor'
          ? 'witty, academic, highlighting architectural trivia and quirky footnotes'
          : tone === 'roast'
          ? 'hilarious, edgy roast of funny tourist blunders and idiosyncratic local habits'
          : tone === 'kid'
          ? 'high-energy, comic-book adventure style with funny onomatopoeias and wonder'
          : 'dramatic, evocative cinematic narrative with rich atmosphere and poetic travel lore';

      const eraGuidance =
        era === '1800s'
          ? '19th century pre-modern historical era, old cobblestones, lantern light, foundational historical figures'
          : era === '1950s'
          ? 'Mid-century golden age of travel (1950s-1960s), retro fashion, post-war transformation, vintage neon'
          : 'Modern 21st-century bustling metropolis, hyper-connected transit, contemporary street culture';

      const prompt = `You are the lead comic writer and cultural historian for POYALO travel app.
Create a vivid, authentic 3-panel comic story for destination: "${placeOrCity}".
Era: ${era} (${eraGuidance}).
Tone: ${tone} (${toneGuidance}).

CRITICAL INSTRUCTIONS:
1. Feature REAL historical figures, real neighborhood names, authentic local slang/phrases, real food dishes, or real architectural landmarks specific to "${placeOrCity}".
2. Follow POYALO's neo-brutalist comic book style:
   - Panel 1: The Arrival / Context Hook
   - Panel 2: The Core Encounter / Conflict / Cultural discovery
   - Panel 3: The Punchline / Climactic Revelation / Traveler Lesson
3. For each panel:
   - "narrativeCaption": 1-2 sentence uppercase header setting the scene (e.g. "MIDNIGHT AT GION CANAL • 1955")
   - "panelScene": Visual description of what the panel depicts
   - "illustrationEmoji": Single fitting emoji (e.g. 🏮, ☕, 👘, 🏛️)
   - "illustrationBgColor": Hex background tint (e.g. #FEF3C7, #DBEAFE, #FCE7F3, #DCFCE7, #EDE9FE, #FFF7ED)
   - "speechBubbles": Exactly 2 distinct dialogue balloons with:
     * "speaker": Character name (e.g. "Local Guide", "Lady Murasaki", "Street Vendor", "Lost Traveler")
     * "avatarEmoji": Single character avatar emoji (e.g. 🤠, 🧐, 🧕, 👨‍🍳, 😅)
     * "text": Punchy, witty dialogue (under 25 words)
     * "type": "speech" | "thought" | "shout"
     * "pointerDirection": "bottom-left" | "bottom-right" | "top"
   - "soundEffect": Comic onomatopoeia decal with:
     * "text": e.g. "CRUNCH!", "SPLASH!", "SWOOSH!", "DING!", "POYALO!"
     * "color": Hex color (e.g. #EF4444, #1B3FFF, #F59E0B, #10B981)
     * "rotationDeg": Degree between -12 and 12

Return ONLY a valid JSON object matching this schema:
{
  "title": "Comic Episode Title",
  "tagline": "Witty 1-sentence subtitle",
  "cityName": "${placeOrCity}",
  "loreSummary": "2-sentence authentic historical or cultural backstory",
  "panels": [
    {
      "panelNumber": 1,
      "narrativeCaption": "...",
      "panelScene": "...",
      "illustrationEmoji": "...",
      "illustrationBgColor": "#FEF3C7",
      "speechBubbles": [
        {
          "speaker": "...",
          "avatarEmoji": "...",
          "text": "...",
          "type": "speech",
          "pointerDirection": "bottom-left"
        }
      ],
      "soundEffect": {
        "text": "...",
        "color": "#1B3FFF",
        "rotationDeg": -6
      }
    }
  ],
  "sources": ["Authentic Reference 1", "Authentic Reference 2"]
}`;

      const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash'];
      let parsedComic: any = null;

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
                  temperature: 0.75
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
              const resJson = Array.isArray(rawJson) ? rawJson[0] : rawJson;
              if (resJson && resJson.panels && resJson.panels.length > 0) {
                parsedComic = resJson;
                break;
              }
            }
          } else {
            const err = await response.text();
            console.warn(`[POYALO API Comic] Model ${model} returned ${response.status}:`, err.slice(0, 200));
          }
        } catch (mErr: any) {
          console.warn(`[POYALO API Comic] Error calling ${model}:`, mErr?.message);
        }
      }

      if (parsedComic) {
        const comicResult: ComicStory = {
          id: `ai-comic-${Date.now()}`,
          placeId: `poi-${placeOrCity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          placeName: placeOrCity,
          cityName: parsedComic.cityName || placeOrCity,
          eraLayer: (era as any) || 'modern',
          tone: (tone as any) || 'storyteller',
          title: parsedComic.title || `${placeOrCity} Story`,
          tagline: parsedComic.tagline || `An illustrated journey through ${placeOrCity}.`,
          panels: parsedComic.panels,
          sources: parsedComic.sources || [`${placeOrCity} Heritage Archive`, 'POYALO Lore Collective']
        };
        return res.status(200).json(comicResult);
      }
    } catch (err: any) {
      console.error('[POYALO API Comic] Live generation error:', err?.message);
    }
  }

  // Guaranteed fallback comic
  const fallback = generateFallbackComic(placeOrCity, tone, era);
  return res.status(200).json(fallback);
}
