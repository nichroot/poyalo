import { ComicStory } from '../types/comic';

export const EXPANDED_COMIC_STORIES: ComicStory[] = [
  // ==========================================
  // 6. AMSTERDAM (AMS)
  // ==========================================
  {
    id: 'story-amsterdam-canals',
    placeId: 'poi-ams-canals',
    placeName: 'Herengracht & Jordaan Canals',
    cityName: 'Amsterdam',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'The Leaning Mansions of Amstel',
    tagline: 'When building on wooden stilts means your living room tilts 12 degrees towards the canal.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1840: JORDAAN CANAL QUARTER...',
        panelScene: 'A Dutch merchant with a top hat staring up at a narrow brick canal house leaning dramatically forward.',
        illustrationEmoji: '🏚️',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Tourist Traveler',
            avatarEmoji: '🧐',
            text: 'Mijnheer! Your townhouse appears to be kissing the house across the street!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Canal House Owner',
            avatarEmoji: '🇳🇱',
            text: 'It is built that way on purpose so hoisted furniture does not smash into the windows! ...also the wooden foundation poles rotted in 1782.',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CREEEAK!',
          color: '#D97706',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'MODERN DAY: BICYCLE SUPREMACY...',
        panelScene: 'A flock of cyclists ringing bells violently as pedestrians accidentally wander into the red bike lane.',
        illustrationEmoji: '🚲',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Commuter on Gazelle Bike',
            avatarEmoji: '🚴🏼‍♂️',
            text: 'CLANG CLANG! Step out of the red asphalt lane or face the wrath of 800,000 Omafiets!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          },
          {
            speaker: 'Dazed Tourist',
            avatarEmoji: '😵‍💫',
            text: 'I thought this was a picturesque footpath?!',
            type: 'thought',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'DING DING!',
          color: '#1B3FFF',
          rotationDeg: 8
        }
      }
    ],
    sources: ['Amsterdam Heritage Archives: Wooden Pile Foundations', 'Gemeente Amsterdam Cycling Census']
  },

  // ==========================================
  // 7. LONDON (LON)
  // ==========================================
  {
    id: 'story-london-tube',
    placeId: 'poi-lon-tube',
    placeName: 'Tower Bridge & Underground',
    cityName: 'London',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'Mind The Labyrinth Gap',
    tagline: 'Deep below the Thames, navigating the oldest underground railway in human history.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1954: PICCADILLY LINE AT RUSH HOUR...',
        panelScene: 'Subterranean tiled tunnels echoing with damp air and the screech of vintage steel wheels.',
        illustrationEmoji: '🚇',
        illustrationBgColor: '#E2E8F0',
        speechBubbles: [
          {
            speaker: 'Subway Busker',
            avatarEmoji: '🎸',
            text: 'Stand clear of the doors! If you make eye contact on the Northern Line, you violate British unwritten law.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Foreign Explorer',
            avatarEmoji: '🧭',
            text: 'I just wanted to change trains from Bank to Monument...',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SCREEECH!',
          color: '#EF4444',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'TOWER OF LONDON: THE RAVEN PLEDGE...',
        panelScene: 'Yeoman Warder (Beefeater) feeding meat to a majestic black raven on the lawn.',
        illustrationEmoji: '🦅',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Ravenmaster Beefeater',
            avatarEmoji: '💂🏼',
            text: 'If the six ravens ever leave the Tower, the Crown shall fall and Britain with it. Which is why their wings are respectfully trimmed!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CAWW!',
          color: '#111827',
          rotationDeg: 6
        }
      }
    ],
    sources: ['London Transport Museum Chronicles', 'Historic Royal Palaces Ravenmaster Records']
  },

  // ==========================================
  // 8. NEW YORK (NYC)
  // ==========================================
  {
    id: 'story-nyc-subway-slice',
    placeId: 'poi-nyc-broadway',
    placeName: 'Times Square & Lower East Side',
    cityName: 'New York',
    eraLayer: '1950s',
    tone: 'roast',
    title: 'The Great Pizza Slice Index',
    tagline: 'When economic theory dictated a subway token and a plain cheese slice must cost the exact same price.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1958: MANHATTAN STREET CORNER...',
        panelScene: 'Steam rising from manhole covers while yellow checker cabs honk at a guy carrying five cardboard pizza boxes.',
        illustrationEmoji: '🍕',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Bronx Pizza Chef',
            avatarEmoji: '👨🏻‍🍳',
            text: 'Fold it down the middle, rookie! If grease doesn\'t drip onto your sneakers, you\'re not eating genuine New York pizza!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Wall Street Intern',
            avatarEmoji: '💼',
            text: 'Fifty cents?! I have a brass transit token, can we do a direct barter?',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'HONK HONK!',
          color: '#F59E0B',
          rotationDeg: 5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'MIDTOWN MANHATTAN: WALKING PACE LAW...',
        panelScene: 'A tidal wave of commuters walking at 4 miles per hour dodging a selfie stick.',
        illustrationEmoji: '🏙️',
        illustrationBgColor: '#E0E7FF',
        speechBubbles: [
          {
            speaker: 'Native New Yorker',
            avatarEmoji: '🗽',
            text: 'Do NOT stop dead in the center of the sidewalk to take a photo of the Empire State Building! Pull to the curb!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'I\'M WALKIN\' HERE!',
          color: '#DC2626',
          rotationDeg: -6
        }
      }
    ],
    sources: ['The New York Times: The Pizza-Subway Fare Equation', 'MTA Historical Archives']
  },

  // ==========================================
  // 9. BARCELONA (BCN)
  // ==========================================
  {
    id: 'story-barcelona-gaudi',
    placeId: 'poi-bcn-sagrada',
    placeName: 'Sagrada Família & Gothic Quarter',
    cityName: 'Barcelona',
    eraLayer: '1800s',
    tone: 'professor',
    title: 'Gaudí\'s Unfinished Forest of Stone',
    tagline: '140 years of chiseling, twisting columns, and stained glass that mimics sunlight through pine trees.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1892: EIXAMPLE DISTRICT DRAFTING DESK...',
        panelScene: 'Antoni Gaudí sketching catenary arches with hanging chains and sandbags.',
        illustrationEmoji: '⛪',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Antoni Gaudí',
            avatarEmoji: '🧔🏻',
            text: 'Straight lines belong to men. Curved lines belong to God. And my client is in no hurry to see this basilica finished!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Apprentice Stonecutter',
            avatarEmoji: '🧱',
            text: 'Master... our grandchildren won\'t see it finished either.',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'TAP TAP TAP!',
          color: '#10B981',
          rotationDeg: 4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'EL BORN: 10:30 PM SUPPER CUSTOM...',
        panelScene: 'Tapas bar buzzing with sizzling pimientos de Padrón and jamón ibérico while tourists try to eat at 6 PM.',
        illustrationEmoji: '🥘',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Catalan Bartender',
            avatarEmoji: '🍷',
            text: 'You want dinner at 6:00 PM?! Señor, we are still digesting lunch! Come back at 10:00 PM for patatas bravas!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CLINK!',
          color: '#EF4444',
          rotationDeg: -5
        }
      }
    ],
    sources: ['Basílica de la Sagrada Família Construction Chronicles', 'Catalan Gastronomy Guild']
  },

  // ==========================================
  // 10. BANGKOK (BKK)
  // ==========================================
  {
    id: 'story-bangkok-tuktuk',
    placeId: 'poi-bkk-chao-phraya',
    placeName: 'Wat Arun & Chao Phraya River',
    cityName: 'Bangkok',
    eraLayer: '1950s',
    tone: 'roast',
    title: 'The Turbo-Charged Tuk-Tuk Rally',
    tagline: 'Weaving through Sukhumvit traffic with blue neon underglow and two-stroke combustion symphony.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1959: YAOWARAT ROAD AT TWILIGHT...',
        panelScene: 'A neon-lit motorized three-wheeler darting between buses with the driver grinning widely.',
        illustrationEmoji: '🛺',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Tuk-Tuk Pilot',
            avatarEmoji: '🛺',
            text: 'Hang onto the handrail boss! This shortcut through the soi cuts 45 minutes of traffic!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Terrified Passenger',
            avatarEmoji: '😱',
            text: 'ARE WE AIRBORNE?!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'VROOOOOOM!',
          color: '#F59E0B',
          rotationDeg: -8
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'GRAND PALACE: THE 168-LETTER CEREMONIAL NAME...',
        panelScene: 'Royal chronicler reciting the full ceremonial Thai name of Bangkok.',
        illustrationEmoji: '📜',
        illustrationBgColor: '#E0E7FF',
        speechBubbles: [
          {
            speaker: 'Royal Chronicler',
            avatarEmoji: '🤴🏽',
            text: 'Krungthepmahanakhon Amonrattanakosin Mahintharayutthaya Mahadilokphop Noppharatratchathaniburirom...',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Visitor',
            avatarEmoji: '✍🏼',
            text: 'Let\'s just stick with Krung Thep, my inkwell is running dry!',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SAWATDEE!',
          color: '#10B981',
          rotationDeg: 5
        }
      }
    ],
    sources: ['Royal Institute of Thailand Toponymy Records', 'Bangkok River & Canal Transport Directorate']
  },

  // ==========================================
  // 11. SINGAPORE (SIN)
  // ==========================================
  {
    id: 'story-singapore-hawker',
    placeId: 'poi-sin-lau-pa-sat',
    placeName: 'Lau Pa Sat & Marina Bay',
    cityName: 'Singapore',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'The Great Tissue Packet Reservation',
    tagline: 'Witnessing the sacred Singaporean art of "Chope" before savoring Michelin-star Hainanese chicken rice.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1955: TELOK AYER MARKET (LAU PA SAT)...',
        panelScene: 'A lunchtime rush inside the Victorian cast-iron pavilion smelling of charcoal satay and laksa.',
        illustrationEmoji: '🍢',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Hawker Stall Aunty',
            avatarEmoji: '👵🏼',
            text: 'Uncle, want more chili or not?! Roast pork belly or char siew? Faster order, queue is 20 people behind!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Office Worker',
            avatarEmoji: '💼',
            text: 'I reserved that round table already lah! See the green tissue packet placed in the center?',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SIZZLE!',
          color: '#DC2626',
          rotationDeg: 4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'FUTURISTIC GARDENS BY THE BAY...',
        panelScene: 'Towering Supertrees glowing with violet and solar lights over the Marina reservoir.',
        illustrationEmoji: '🌳',
        illustrationBgColor: '#EDE9FE',
        speechBubbles: [
          {
            speaker: 'Eco-Engineer',
            avatarEmoji: '👩🏻‍🔬',
            text: 'These Supertrees collect rainwater, vent conservatory heat, and generate solar power. Nature and engineering in sync!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'SHINE!',
          color: '#8B5CF6',
          rotationDeg: -5
        }
      }
    ],
    sources: ['UNESCO Representative List of Intangible Cultural Heritage: Hawker Culture in Singapore', 'Gardens by the Bay Botanical Engineering Dossier']
  },

  // ==========================================
  // 12. ISTANBUL (IST)
  // ==========================================
  {
    id: 'story-istanbul-cats-bosphorus',
    placeId: 'poi-ist-hagia-sophia',
    placeName: 'Hagia Sophia & Grand Bazaar',
    cityName: 'Istanbul',
    eraLayer: '1800s',
    tone: 'storyteller',
    title: 'The Feline Sovereigns of Byzantium',
    tagline: 'Two continents, six millennia of empires, and one million stray cats who officially own every cobblestone.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'HISTORIC PENINSULA: DOME OF HAGIA SOPHIA...',
        panelScene: 'Emperor looking up in awe at the soaring marble dome while a tortoiseshell cat naps on the altar steps.',
        illustrationEmoji: '🐈',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Imperial Architect',
            avatarEmoji: '👑',
            text: 'The grand dome seems suspended from the heavens! ...Now who allowed this tabby kitten to sleep upon the purple cushion?',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Cat of Constantinople',
            avatarEmoji: '🐱',
            text: 'Prrrr. I have guarded the grain silos from mice. Your empire is merely my cat tree.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'MEOW!',
          color: '#F59E0B',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'KAPALIÇARŞI (GRAND BAZAAR): 4,000 SHOPS...',
        panelScene: 'A spice merchant brewing black tea in tulip-shaped glasses surrounded by mounds of sumac and saffron.',
        illustrationEmoji: '🫖',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Carpet & Spice Merchant',
            avatarEmoji: '🧔🏻‍♂️',
            text: 'Have a glass of apple tea my friend. In this bazaar, bargaining is not an argument; it is a sacred conversation!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'POURRR!',
          color: '#EF4444',
          rotationDeg: 5
        }
      }
    ],
    sources: ['Istanbul Historical Peninsula Preservation Survey', 'Evliya Çelebi: Book of Travels (Seyahatnâme)']
  },

  // ==========================================
  // 13. CAIRO (CAI)
  // ==========================================
  {
    id: 'story-cairo-pyramids',
    placeId: 'poi-cai-pyramids',
    placeName: 'Giza Plateau & Khan el-Khalili',
    cityName: 'Cairo',
    eraLayer: '1800s',
    tone: 'storyteller',
    title: 'The Sweat and Beer of Khufu\'s Masons',
    tagline: 'Disproving alien theories with 2.3 million limestone blocks and a daily ration of garlic and fermented barley.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'GIZA QUARRY WORKERS\' VILLAGE CHRONICLES...',
        panelScene: 'Master Egyptian masons leveling a massive 2.5-ton limestone casing block with water troughs and wooden sledges.',
        illustrationEmoji: '📐',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Chief Mason Ankhaf',
            avatarEmoji: '👷🏾‍♂️',
            text: 'Wet the sand in front of the cedar sledges! It cuts the friction in half! And make sure the master surveyor checks the north alignment!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Apprentice Scribe',
            avatarEmoji: '📜',
            text: 'Chief, in thousands of years people on television will claim space aliens with lasers built this instead of us!',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'HEAVE HO!',
          color: '#D97706',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'KHAN EL-KHALILI: 14TH CENTURY LABYRINTH...',
        panelScene: 'Brass craftsmen hammering ornate perforated lamps while mint tea boils over hot coals.',
        illustrationEmoji: '🏮',
        illustrationBgColor: '#FEF08A',
        speechBubbles: [
          {
            speaker: 'Brass Lantern Artisan',
            avatarEmoji: '👴🏾',
            text: 'Every brass lantern tells a story of the Mamluk sultans. Hold it up to the flame and watch constellations appear on your wall!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'TING TING!',
          color: '#CA8A04',
          rotationDeg: 4
        }
      }
    ],
    sources: ['Mark Lehner: Giza Plateau Mapping Project & Workers Village Excavations', 'Wadi al-Jarf Papyrus (Diary of Merer)']
  },

  // ==========================================
  // 14. KYOTO (KYO)
  // ==========================================
  {
    id: 'story-kyoto-torii-gates',
    placeId: 'poi-kyo-fushimi',
    placeName: 'Fushimi Inari & Gion Alleys',
    cityName: 'Kyoto',
    eraLayer: '1800s',
    tone: 'professor',
    title: 'Ten Thousand Vermilion Portals',
    tagline: 'Ascending sacred Mount Inari under a hypnotic canopy of sunlit orange arches gifted by merchants.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'INARI MOUNTAIN SHRINE SLOPES...',
        panelScene: 'Shinto priests honoring the sacred white fox messenger (Kitsune) bearing the key to the rice granary.',
        illustrationEmoji: '🦊',
        illustrationBgColor: '#FFEDD5',
        speechBubbles: [
          {
            speaker: 'Shinto Priest',
            avatarEmoji: '⛩️',
            text: 'The vermilion pigment protects the wood against damp mountain moss. Each torii gate was placed here by a merchant giving thanks for prosperity.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Stone Fox Statue',
            avatarEmoji: '🦊',
            text: 'Leave a fried tofu offering (aburaage) before you climb the mountain steps!',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SUZU BELL!',
          color: '#EA580C',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'GION PRESERVED LANTERN DISTRICT...',
        panelScene: 'A quiet flagstone alleyway lined with dark wooden machiya latticework and sliding paper screens.',
        illustrationEmoji: '🏮',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Tea Master',
            avatarEmoji: '🍵',
            text: 'Ichi-go ichi-e (One time, one meeting). Cherish every cup of matcha, for this exact moment will never happen again in your lifetime.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'WHISK...',
          color: '#16A34A',
          rotationDeg: 3
        }
      }
    ],
    sources: ['Kyoto City Cultural Preservation Heritage Records', 'Fushimi Inari-taisha Shrine Historical Compendium']
  },

  // ==========================================
  // 15. VENICE (VCE)
  // ==========================================
  {
    id: 'story-venice-lagoon-high-tide',
    placeId: 'poi-vce-grand-canal',
    placeName: 'Grand Canal & Piazza San Marco',
    cityName: 'Venice',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'The Catwalks of Acqua Alta',
    tagline: 'When high tide turns St. Mark\'s Square into a saltwater swimming pool and rubber boots become haute couture.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1870: PIAZZA SAN MARCO AT FULL MOON...',
        panelScene: 'Saltwater surging through the storm drains while waiters in tuxedos balance silver trays on elevated wooden boardwalks.',
        illustrationEmoji: '🌊',
        illustrationBgColor: '#CFFAFE',
        speechBubbles: [
          {
            speaker: 'Caffè Florian Head Waiter',
            avatarEmoji: '🤵🏻',
            text: 'High tide is rising signore! Please step onto the wooden catwalk (passerelle) while sipping your espresso!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Venetian Gondolier',
            avatarEmoji: '🛶',
            text: 'My wooden hull needs just 10 more centimeters of clearance under the Rialto bridge or we sleep in the lagoon tonight!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SPLASHHH!',
          color: '#0284C7',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'DOGE\'S PALACE: THE LION OF VENICE...',
        panelScene: 'The winged bronze Lion of Saint Mark overlooking the misty Adriatic lagoon.',
        illustrationEmoji: '🦁',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Historian',
            avatarEmoji: '📜',
            text: 'Built on millions of petrified alder tree trunks driven into the lagoon mud 1,000 years ago, completely devoid of oxygen so they never decay!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'OHEEEE!',
          color: '#1B3FFF',
          rotationDeg: 4
        }
      }
    ],
    sources: ['Venice Lagoon Hydraulic Engineering Commission Archive', 'Caffè Florian Historical Annals']
  },

  // ==========================================
  // 16. BERLIN (BER)
  // ==========================================
  {
    id: 'story-berlin-wall-spati',
    placeId: 'poi-ber-brandenburg',
    placeName: 'Brandenburg Gate & Kreuzberg',
    cityName: 'Berlin',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'The Späti Philosophy of Midnight Berlin',
    tagline: 'Corner kiosks, cold Club Mate, and the unstoppable creative pulse of a reunited capital.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1958: BORDER MEMORIES AT THE SPREE...',
        panelScene: 'Citizens gathering near the historic sector line while bicycles and vintage trams rumble past.',
        illustrationEmoji: '🧱',
        illustrationBgColor: '#E2E8F0',
        speechBubbles: [
          {
            speaker: 'East Berlin Student',
            avatarEmoji: '🧥',
            text: 'Listen to the jazz from the other bank! No concrete barrier can ever silence human curiosity and friendship!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'West Berlin Artist',
            avatarEmoji: '🎨',
            text: 'We are turning every brick wall into a canvas of hope and shared imagination!',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'FREIHEIT!',
          color: '#10B981',
          rotationDeg: 5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'KREUZBERG: 2:00 AM AT THE CORNER SPÄTI...',
        panelScene: 'A neon-lit corner shop with wooden beer crates on the sidewalk and a DJ crate sitting nearby.',
        illustrationEmoji: '🏪',
        illustrationBgColor: '#FEF08A',
        speechBubbles: [
          {
            speaker: 'Späti Shop Owner',
            avatarEmoji: '🧔🏻',
            text: 'Cold sparkling mate or currywurst? Sit on the beer crate outside, discuss music, and take your time. Berlin never rushes.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'TZZZZ!',
          color: '#D97706',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Berlin Wall Memorial Historical Archive', 'Kreuzberg Späti Cultural Preservation Initiative']
  },

  // ==========================================
  // 17. SYDNEY (SYD)
  // ==========================================
  {
    id: 'story-sydney-opera-shells',
    placeId: 'poi-syd-opera',
    placeName: 'Sydney Opera House & The Rocks',
    cityName: 'Sydney',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'The Orange-Peel Sail Shells of Bennelong Point',
    tagline: 'When an architect peeled an orange and solved an engineering crisis that baffled the world.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1957: ARCHITECTURAL CRISIS ON BENNELONG POINT...',
        panelScene: 'Danish architect Jørn Utzon holding up segments of an orange peel next to a drafting table overlooking Sydney Harbour.',
        illustrationEmoji: '🍊',
        illustrationBgColor: '#FFEDD5',
        speechBubbles: [
          {
            speaker: 'Jørn Utzon',
            avatarEmoji: '📐',
            text: 'Eureka! We don\'t need custom parabola calculations for every single roof vault! Every sail shell can be cut from the exact same sphere!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Harbour Ferry Captain',
            avatarEmoji: '⛴️',
            text: 'Mate, it looks like majestic yacht sails catching the sea breeze as we cruise into Circular Quay!',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'HONK!',
          color: '#0284C7',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'SPRINGTIME: THE MAGPIE SWOOPING PROTOCOL...',
        panelScene: 'A cyclist wearing a helmet with zip ties sticking out like antennae pedaling furiously past a park tree.',
        illustrationEmoji: '🚴🏼‍♂️',
        illustrationBgColor: '#DCFCE7',
        speechBubbles: [
          {
            speaker: 'Aussie Local',
            avatarEmoji: '🇦🇺',
            text: 'Keep moving mate! Don\'t run, just maintain eye contact with the magpie! It\'s nesting season in the gum trees!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'SWOOOP!',
          color: '#DC2626',
          rotationDeg: -7
        }
      }
    ],
    sources: ['Sydney Opera House World Heritage Inscription Dossier', 'Ove Arup & Partners Structural Engineering Records']
  }
];
