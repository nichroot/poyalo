import { ComicStory, ComicTone, EraLayer } from '../types/comic';
import { EXPANDED_COMIC_STORIES } from './mockComicsExpanded';

export interface ComicCityOption {
  id: string;
  name: string;
  country: string;
  flag: string;
  landmark: string;
}

export const COMIC_CITIES: ComicCityOption[] = [
  { id: 'Dubai', name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', landmark: 'Khor Dubai & Pearl Banks' },
  { id: 'Tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', landmark: 'Asakusa & Tokyo Tower' },
  { id: 'Paris', name: 'Paris', country: 'France', flag: '🇫🇷', landmark: 'Montmartre & Grand Boulevards' },
  { id: 'Rome', name: 'Rome', country: 'Italy', flag: '🇮🇹', landmark: 'Roman Forum & Trevi Fountain' },
  { id: 'Kozhikode', name: 'Kozhikode', country: 'India (Malabar Coast)', flag: '🇮🇳', landmark: 'Beypore Uru & Spice Port' },
  { id: 'Amsterdam', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', landmark: 'Canal Ring & Jordaan' },
  { id: 'London', name: 'London', country: 'United Kingdom', flag: '🇬🇧', landmark: 'Tower Bridge & Westminster' },
  { id: 'New York', name: 'New York', country: 'United States', flag: '🇺🇸', landmark: 'Times Square & Lower East Side' },
  { id: 'Barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', landmark: 'Sagrada Família & Gothic Quarter' },
  { id: 'Bangkok', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', landmark: 'Wat Arun & Chao Phraya River' },
  { id: 'Singapore', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', landmark: 'Marina Bay & Lau Pa Sat' },
  { id: 'Istanbul', name: 'Istanbul', country: 'Turkey', flag: '🇹🇷', landmark: 'Hagia Sophia & Grand Bazaar' },
  { id: 'Cairo', name: 'Cairo', country: 'Egypt', flag: '🇪🇬', landmark: 'Giza Pyramids & Khan el-Khalili' },
  { id: 'Kyoto', name: 'Kyoto', country: 'Japan', flag: '🇯🇵', landmark: 'Fushimi Inari & Gion Alleys' },
  { id: 'Venice', name: 'Venice', country: 'Italy', flag: '🇮🇹', landmark: 'Grand Canal & Piazza San Marco' },
  { id: 'Berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', landmark: 'Brandenburg Gate & Kreuzberg' },
  { id: 'Sydney', name: 'Sydney', country: 'Australia', flag: '🇦🇺', landmark: 'Opera House & The Rocks' }
];

// ==========================================
// 1. DUBAI & THE ARABIAN GULF (DXB)
// ==========================================
export const DUBAI_COMIC_STORIES: ComicStory[] = [
  // 1a. TONE: ROAST | ERA: 1800s
  {
    id: 'story-creek-roast-1800s',
    placeId: 'poi-creek-abra',
    placeName: 'Khor Dubai & Pearl Banks',
    cityName: 'Dubai',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'The Great Oyster Gamble',
    tagline: 'When 40 dives a day earned you half a dried date and turtle-shell nose clips.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1880: THE CREEK BEFORE AIR CONDITIONING...',
        panelScene: 'A wooden sambuk dhow preparing for a 4-month voyage into the sweltering Gulf.',
        illustrationEmoji: '⛵',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Captain (Nokhada)',
            avatarEmoji: '🧔🏽‍♂️',
            text: 'Welcome aboard lads! 4 months at sea, 50°C heat, and your only safety equipment is a turtle clip (Al-Fattam) on your nose!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Young Diver (Ghays)',
            avatarEmoji: '🏊🏽‍♂️',
            text: 'Wait... do we get dental insurance or at least drinking water?',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SPLASH!',
          color: '#1B3FFF',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: '20 METERS DEEP IN THE PERSIAN GULF...',
        panelScene: 'Diver descending with a 5kg stone sinker (Al-Zubra) to grab oysters.',
        illustrationEmoji: '🦪',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Young Diver',
            avatarEmoji: '🏊🏽‍♂️',
            text: 'I found an oyster! I am going to buy a camel and retire in the oasis!',
            type: 'thought',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Passing Sea Turtle',
            avatarEmoji: '🐢',
            text: 'Bro, that is literally a clump of sea moss. Good luck paying off your boat loan.',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'GULP!',
          color: '#10B981',
          rotationDeg: 8
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'MEANWHILE, AT THE SOUK AUCTION...',
        panelScene: 'The wealthy pearl merchant (Tawwash) weighing goods with copper scales.',
        illustrationEmoji: '⚖️',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Pearl Merchant (Tawwash)',
            avatarEmoji: '👳🏽‍♂️',
            text: 'Splendid natural luster! Paris and Bombay will pay 50,000 Gulf Rupees. Here is your 2 dirhams diver, don’t spend it all on dates.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Young Diver',
            avatarEmoji: '😵‍💫',
            text: 'Capitalism was invented in 1885 right here on Dubai Creek, I swear.',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CHA-CHING!',
          color: '#FF5722',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Dubai Pearl Museum Historical Archives', 'J.G. Lorimer’s Gazetteer of the Persian Gulf (1908)']
  },

  // 1b. TONE: PROFESSOR | ERA: 1800s
  {
    id: 'story-creek-prof-1800s',
    placeId: 'poi-alfahidi-wind',
    placeName: 'Al Fahidi Barajeel Towers',
    cityName: 'Dubai',
    eraLayer: '1800s',
    tone: 'professor',
    title: 'Zero-Energy Windcatcher Physics',
    tagline: 'How 19th-century Gulf architects used Bernoulli pressure differentials to beat 50°C heat.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'ARCHITECTURAL ANALYSIS: THE BARAJEEL TOWER',
        panelScene: 'Cross-section of a 4-sided gypsum and coral stone tower rising above a courtyard house.',
        illustrationEmoji: '🏛️',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Prof. Al-Maktoum',
            avatarEmoji: '👨🏽‍🏫',
            text: 'Notice the quadrilateral design. As maritime winds strike the top vents, positive pressure forces cool coastal air downwards.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'WHOOSH!',
          color: '#3B82F6',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'INDOOR MICROCLIMATE GENERATION',
        panelScene: 'Air circulating over a damp clay jar placed in the central majlis floor.',
        illustrationEmoji: '🏺',
        illustrationBgColor: '#E0F2FE',
        speechBubbles: [
          {
            speaker: 'Prof. Al-Maktoum',
            avatarEmoji: '👨🏽‍🏫',
            text: 'By placing porous terracotta water pots directly below the chimney, incoming air cools by up to 10°C via evaporative heat exchange.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Merchant Host',
            avatarEmoji: '👳🏽‍♂️',
            text: 'Zero electricity bills since 1890, Professor! Fully sustainable thermodynamics.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CHILL!',
          color: '#10B981',
          rotationDeg: 4
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'THE EXHAUST CYCLE: STACK EFFECT',
        panelScene: 'Warm stale air rising through the opposite vents into the desert sky.',
        illustrationEmoji: '💨',
        illustrationBgColor: '#F3F4F6',
        speechBubbles: [
          {
            speaker: 'Prof. Al-Maktoum',
            avatarEmoji: '👨🏽‍🏫',
            text: 'Simultaneously, negative leeward pressure draws warm indoor air up and out. A passive solar ventilator with zero moving parts.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'VENT!',
          color: '#F59E0B',
          rotationDeg: -3
        }
      }
    ],
    sources: ['Dubai Municipality Architectural Heritage Department', 'Vernacular Architecture of the Trucial States (Hawley, 1970)']
  },

  // 1c. TONE: STORYTELLER | ERA: 1950s
  {
    id: 'story-creek-story-1950s',
    placeId: 'poi-creek-abra',
    placeName: 'Khor Dubai Dredging Trench',
    cityName: 'Dubai',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'The Great Silt Gamble of 1954',
    tagline: 'When Sheikh Rashid bet the emirate’s future on borrowed Austrian dredgers and merchant bonds.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1954: SILT BLOCKS THE LIFEBLOOD OF THE TRADING CITY',
        panelScene: 'Cargo dhows trapped on treacherous sandbars at the shallow mouth of Dubai Creek.',
        illustrationEmoji: '⚓',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Old Sea Captain',
            avatarEmoji: '🧔🏽‍♂️',
            text: 'The creek is choking. At low tide, our ships scrape the mud. If we cannot dock, the trade will flee to Kuwait or Qatar.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'SCRAPE!',
          color: '#EF4444',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'SHEIKH RASHID MAKES THE AUDACIOUS CALL',
        panelScene: 'Consulting engineers Sir William Halcrow & Partners presenting dredging blueprints.',
        illustrationEmoji: '📜',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Sheikh Rashid',
            avatarEmoji: '👑',
            text: 'We do not wait for oil. We borrow £400,000 from our brothers in Kuwait, dredge this creek to 3 meters deep, and the world will sail to us.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'British Engineer',
            avatarEmoji: '🧐',
            text: 'Sir, it is a massive gamble. But the tidal currents are on our side.',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'PLEDGE!',
          color: '#1B3FFF',
          rotationDeg: 4
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: '1959: THE STEAM DREDGERS CONQUER THE SANDBAR',
        panelScene: 'Massive pipes pouring 3.5 million cubic meters of reclaimed silt into the Deira corniche.',
        illustrationEmoji: '🏗️',
        illustrationBgColor: '#E0F2FE',
        speechBubbles: [
          {
            speaker: 'Merchant Leader',
            avatarEmoji: '👳🏽‍♂️',
            text: 'The 500-ton cargo dhows are gliding in! What was once a shallow lagoon is now the gateway of Arabia!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'ROAR!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Records of the Emirates 1853–1960 (Archive Editions)', 'Sir William Halcrow & Partners Engineering Records (1958)']
  },

  // 1d. TONE: KID | ERA: MODERN
  {
    id: 'story-creek-kid-modern',
    placeId: 'poi-ain-dubai',
    placeName: 'Ain Dubai & VG World Skyline',
    cityName: 'Dubai',
    eraLayer: 'modern',
    tone: 'kid',
    title: 'The Skyline Pearl Quest',
    tagline: 'Hop aboard the super-fast Abra boat as it zooms past giant observation wheels into the future!',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'WELCOME TO 2026: THE FUTURE IS TODAY!',
        panelScene: 'A cheerful kid wearing a sunhat boarding a high-tech electric Abra at the creek.',
        illustrationEmoji: '🚤',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Abra the Boat',
            avatarEmoji: '⛵',
            text: 'BEEP BOOP! Hold onto your sunhats! We are cruising past 200 years of history in 5 seconds!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Little Explorer',
            avatarEmoji: '🎒',
            text: 'Look at the giant Ain Dubai wheel! Can we climb all the way to the clouds?',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'VROOOM!',
          color: '#1B3FFF',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'FLYING HIGH OVER THE BLUEWATERS ISLAND!',
        panelScene: 'Looking out over the revolving capsules of Ain Dubai with shimmering gulf waters.',
        illustrationEmoji: '🎡',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Abra the Boat',
            avatarEmoji: '⛵',
            text: 'Ain Dubai is 250 meters tall! That is double the height of the London Eye!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Little Explorer',
            avatarEmoji: '🎒',
            text: 'I can see the desert dunes and the Burj Khalifa from all the way up here!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'WHOA!',
          color: '#FF5722',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'SECRET TREASURE CHEST UNLOCKED IN VG WORLD!',
        panelScene: 'Finding glowing golden Arabian pearls and brass dallahs in the 3D game.',
        illustrationEmoji: '🎁',
        illustrationBgColor: '#DCFCE7',
        speechBubbles: [
          {
            speaker: 'Little Explorer',
            avatarEmoji: '🎒',
            text: 'I found 4 pearls and an authentic Bedouin tea set! High score unlocked!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'DING DING!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Kids Guide to UAE Heritage', 'Children’s Museum of Dubai (OliOli)']
  }
];

// ==========================================
// 2. TOKYO, JAPAN (TYO / HND)
// ==========================================
export const TOKYO_COMIC_STORIES: ComicStory[] = [
  // 2a. TONE: ROAST | ERA: 1800s
  {
    id: 'story-tokyo-roast-1800s',
    placeId: 'poi-asakusa-sensoji',
    placeName: 'Asakusa Senso-ji & Sumida River',
    cityName: 'Tokyo',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'The Shogun’s Dress Code Police',
    tagline: 'When wearing bright silk got you banished, so Edo rebels invented inside-out fashion.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1842: EDO TOWN UNDER STRICT SUMPTUARY LAWS...',
        panelScene: 'A Shogunate magistrate patrolling the merchant district with a measuring bamboo pole.',
        illustrationEmoji: '🏯',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Samurai Magistrate',
            avatarEmoji: '👺',
            text: 'Citizens of Edo! By order of the Shogun, no bright colors, no gold hairpins, and no luxury fabric! Only drab brown and gray cotton!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Merchant (Chonin)',
            avatarEmoji: '👘',
            text: 'Yes officer, look at my incredibly boring, plain dark gray kimono. Definitely zero fun happening here.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'STOMP!',
          color: '#EF4444',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'BEHIND CLOSED SHOJI SCREENS AT THE TEA HOUSE...',
        panelScene: 'The merchant opening his outer robe to reveal a breathtaking silk dragon lining.',
        illustrationEmoji: '🐉',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Merchant',
            avatarEmoji: '👘',
            text: 'Behold! Hand-painted scarlet silk with gold dragon leaf hidden entirely on the INSIDE lining! We call this "Iki" subtle rebellious chic.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Geisha Hostess',
            avatarEmoji: '🪭',
            text: 'You spent 50 gold ryo just to troll the magistrate? Respect.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SWOOSH!',
          color: '#FF5722',
          rotationDeg: 7
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'MEANWHILE, AT THE STREET SOBA YATAI...',
        panelScene: 'Slurping hot buckwheat noodles loudly while dodging the fire patrol.',
        illustrationEmoji: '🍜',
        illustrationBgColor: '#E0F2FE',
        speechBubbles: [
          {
            speaker: 'Soba Vendor',
            avatarEmoji: '👨🏽‍🍳',
            text: 'Eat fast! If the fire watch bells ring, this entire wooden block burns in 8 minutes flat!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Merchant',
            avatarEmoji: '👘',
            text: 'Edo: Where life is short, the noodles are fast, and the tax evasion is high fashion.',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SLUUURP!',
          color: '#1B3FFF',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Tokugawa Jikki (Official Annals of the Shogunate)', 'Edward Seidensticker’s Low City, High City (Tokyo 1867–1923)']
  },

  // 2b. TONE: PROFESSOR | ERA: 1950s
  {
    id: 'story-tokyo-prof-1950s',
    placeId: 'poi-tokyo-tower',
    placeName: 'Tokyo Tower & Shiba Park',
    cityName: 'Tokyo',
    eraLayer: '1950s',
    tone: 'professor',
    title: 'Tanks Melted into Transmission Spire',
    tagline: 'How 90 decommissioned US Army tanks were recycled into the 332.9-meter symbol of post-war rebirth.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1957: POST-WAR STEEL SHORTAGE THREATENS NATIONAL BROADCASTING',
        panelScene: 'Architect Tachu Naito calculating wind and seismic load on a slide rule.',
        illustrationEmoji: '📐',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Dr. Tachu Naito',
            avatarEmoji: '👨🏻‍🏫',
            text: 'To blanket the entire Kanto plain with NHK television signals, we need a 333-meter mast. But high-tensile steel in post-war Japan is almost non-existent.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CALCULATE!',
          color: '#1B3FFF',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'SCRAP METAL CONTRACT: US ARMY M47 SHERMAN TANKS',
        panelScene: 'Steel mills in Yawata melting armor plate into structural girder beams.',
        illustrationEmoji: '🛡️',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Metallurgist',
            avatarEmoji: '👷🏻',
            text: 'We acquired 90 surplus Korean War US tanks. Their alloy armor plate possesses the exact tensile yield strength needed for the top 100 meters of the spire!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CLANG!',
          color: '#FF5722',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'DECEMBER 1958: ERECTION WITHOUT A SINGLE FATAL ACCIDENT',
        panelScene: 'Traditional Tobi steeplejacks bolting red-and-white steel beams into the sky.',
        illustrationEmoji: '🗼',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Dr. Tachu Naito',
            avatarEmoji: '👨🏻‍🏫',
            text: 'Tokyo Tower stands at 332.9 meters—13 meters taller than the Eiffel Tower, yet 3,000 tons lighter due to advanced truss engineering.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'BROADCAST!',
          color: '#10B981',
          rotationDeg: -3
        }
      }
    ],
    sources: ['Tokyo Tower Construction Records (Nippon Television City Corp, 1958)', 'Nippon Steel Historical Monograph']
  },

  // 2c. TONE: STORYTELLER | ERA: MODERN
  {
    id: 'story-tokyo-story-modern',
    placeId: 'poi-shibuya-scramble',
    placeName: 'Shibuya Scramble & Akihabara',
    cityName: 'Tokyo',
    eraLayer: 'modern',
    tone: 'storyteller',
    title: 'The 3,000-Soul Scramble',
    tagline: 'When pedestrian lights turn green, three thousand strangers choreograph a silent, collision-free ballet.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '21:00 PM: UNDER THE GLOW OF 10-STORY NEON BILLBOARDS...',
        panelScene: 'Pedestrians waiting behind the white tactile paving at Shibuya Hachiko exit.',
        illustrationEmoji: '🚦',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Narrator',
            avatarEmoji: '🎙️',
            text: 'The pedestrian light blinks green. A heartbeat of stillness—then a tidal wave of 3,000 humans surge from every corner toward the center.',
            type: 'thought',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'PULSE!',
          color: '#10B981',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'MICRO-ADJUSTMENTS: THE SCIENCE OF JAPANESE CROWD FLOW',
        panelScene: 'People gliding past each other with polite millimetric shoulder tilts.',
        illustrationEmoji: '🚶🏻',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Salaryman',
            avatarEmoji: '💼',
            text: 'Not a single push. Not an apology needed. It is a shared consciousness of respect and peripheral awareness.',
            type: 'thought',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Foreign Traveler',
            avatarEmoji: '🎒',
            text: 'In New York this would be an MMA bout. Here it is a symphony.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'FLOW!',
          color: '#3B82F6',
          rotationDeg: 5
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'SAFE AT THE 24/7 CORNER RAMEN COUNTER',
        panelScene: 'Steaming bowl of tonkotsu ramen served through a bamboo curtain in total peace.',
        illustrationEmoji: '🍜',
        illustrationBgColor: '#FEF9C3',
        speechBubbles: [
          {
            speaker: 'Master Chef',
            avatarEmoji: '👨🏻‍🍳',
            text: 'Irrashaimase. 3,000 souls crossed the street, but right now, only your broth exists.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'PERFECTION!',
          color: '#FF5722',
          rotationDeg: -3
        }
      }
    ],
    sources: ['Tokyo Metropolitan Government Urban Mobility White Paper (2025)', 'Shibuya Ward Historical Society']
  }
];

// ==========================================
// 3. PARIS, FRANCE (CDG / ORY)
// ==========================================
export const PARIS_COMIC_STORIES: ComicStory[] = [
  // 3a. TONE: ROAST | ERA: 1800s
  {
    id: 'story-paris-roast-1800s',
    placeId: 'poi-boulevards-eiffel',
    placeName: 'Grand Boulevards & Eiffel Tower',
    cityName: 'Paris',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'Haussmann’s Sledgehammer Boulevard',
    tagline: 'When the government demolished 20,000 medieval apartments just so cavalry could charge protestors.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1853: BARON HAUSSMANN UNROLLS HIS SLEDGEHAMMER MAP...',
        panelScene: 'Baron Haussmann drawing bold straight red lines through cramped medieval alleys.',
        illustrationEmoji: '📐',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Baron Haussmann',
            avatarEmoji: '🧐',
            text: 'Napoleon III says these narrow alleys are too easy for protestors to build barricades! Tear down 20,000 houses! We need avenues wide enough for cannons!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Parisian Baker',
            avatarEmoji: '🥖',
            text: 'Mon dieu! My bakery has been here since Joan of Arc! Where do I put my baguettes?!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CRASH!',
          color: '#EF4444',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: '1887: WRITERS SIGN THE INFAMOUS PETITION AGAINST THE EIFFEL TOWER',
        panelScene: 'Guy de Maupassant furiously drafting a letter of disgust in a Montmartre café.',
        illustrationEmoji: '✒️',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Guy de Maupassant',
            avatarEmoji: '🧔🏻‍♂️',
            text: 'This giant iron monstrosity! A tragic factory smokestack that will humiliate Paris in front of the civilized world!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Gustave Eiffel',
            avatarEmoji: '🎩',
            text: 'Don’t worry Guy, I will put a restaurant inside it and you will dine there every lunch.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SCANDAL!',
          color: '#FF5722',
          rotationDeg: 7
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'TODAY: TOURISTS PAY €35 TO CLIMB THE "FACTORY SMOKESTACK"',
        panelScene: 'Smiling crowds taking selfies at Trocadéro with the glittering tower.',
        illustrationEmoji: '🗼',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Maupassant’s Ghost',
            avatarEmoji: '👻',
            text: 'I eat lunch inside the Eiffel Tower every single day... because it is the only place in Paris where I don’t have to look at it!',
            type: 'thought',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'IRONIE!',
          color: '#1B3FFF',
          rotationDeg: -5
        }
      }
    ],
    sources: ['Mémoires du Baron Haussmann (1890)', 'Le Temps: Protestation des Artistes contre la Tour Eiffel (14 Février 1887)']
  },

  // 3b. TONE: PROFESSOR | ERA: 1950s
  {
    id: 'story-paris-prof-1950s',
    placeId: 'poi-saint-germain',
    placeName: 'Saint-Germain-des-Prés & Café de Flore',
    cityName: 'Paris',
    eraLayer: '1950s',
    tone: 'professor',
    title: 'Existentialism on the Left Bank',
    tagline: 'Why Jean-Paul Sartre and Simone de Beauvoir wrote philosophy in cafés: unheated apartments.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'WINTER 1946: COAL RATIONING SHAKES POST-WAR PARIS',
        panelScene: 'Drafty Latin Quarter apartment with frost creeping up the single-pane glass.',
        illustrationEmoji: '🥶',
        illustrationBgColor: '#E0F2FE',
        speechBubbles: [
          {
            speaker: 'Prof. Historian',
            avatarEmoji: '👩🏻‍🏫',
            text: 'Popular mythology claims French intellectuals sat in cafés out of romantic Bohemian spirit. The harsh historical reality was coal rationing: cafés possessed cast-iron coal stoves.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'BRRRR!',
          color: '#3B82F6',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'CAFÉ DE FLORE: THE IMPROMPTU WRITING OFFICE',
        panelScene: 'Simone de Beauvoir and Sartre at a marble table with fountain pens and espresso.',
        illustrationEmoji: '☕',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Simone de Beauvoir',
            avatarEmoji: '🖋️',
            text: 'We arrived at 9 AM, wrote until noon, had lunch, and stayed until 8 PM. For the price of two hot coffees, we had heat, light, and total creative freedom.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'SCRATCH!',
          color: '#1B3FFF',
          rotationDeg: 5
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'THE BIRTH OF BE-BOP JAZZ IN SUBTERRANEAN CELLARS',
        panelScene: 'Miles Davis playing trumpet with Juliette Gréco in a medieval stone vault.',
        illustrationEmoji: '🎺',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Prof. Historian',
            avatarEmoji: '👩🏻‍🏫',
            text: 'Downstairs at Le Caveau de la Huchette, American jazz musicians found an audience free of segregation, creating the modern soundtrack of Parisian existentialism.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'BE-BOP!',
          color: '#10B981',
          rotationDeg: -3
        }
      }
    ],
    sources: ['Simone de Beauvoir: Force of Circumstance (1963)', 'Archives de la Ville de Paris: Ravitaillement et Chauffage 1945–1950']
  },

  // 3c. TONE: STORYTELLER | ERA: MODERN
  {
    id: 'story-paris-story-modern',
    placeId: 'poi-seine-boulangerie',
    placeName: 'The Seine & Artisanal Boulangeries',
    cityName: 'Paris',
    eraLayer: 'modern',
    tone: 'storyteller',
    title: 'The 4-Ingredient Baguette Law',
    tagline: 'When a nation passes a decree protecting bread with strictly four ingredients and a 20-minute crunch.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '05:00 AM: THE WOOD-FIRED DECK OVENS OF THE 11TH ARRONDISSEMENT',
        panelScene: 'Baker scoring the pale dough with a razor-sharp grignoir blade.',
        illustrationEmoji: '🥖',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Master Baker',
            avatarEmoji: '👨🏻‍🍳',
            text: 'French Decree No. 93-1074: A Tradition Baguette can contain only four elements: wheat flour, water, salt, and yeast. No additives, no freezing, ever.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CRACKLE!',
          color: '#FF5722',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'THE SOUND TEST: THE CRUST MUSIC OF PARIS',
        panelScene: 'Gently squeezing the golden loaf near the ear to hear the delicate crust sing.',
        illustrationEmoji: '👂🏻',
        illustrationBgColor: '#FEF9C3',
        speechBubbles: [
          {
            speaker: 'Master Baker',
            avatarEmoji: '👨🏻‍🍳',
            text: 'Listen to the crumb singing as it cools. If it does not crackle like crisp autumn leaves, it is not worthy of Paris.',
            type: 'thought',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CRUNCH!',
          color: '#F59E0B',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'WALKING HOME ALONG THE SEINE QUAY',
        panelScene: 'Biting off the warm pointy end (le quignon) before reaching the front door.',
        illustrationEmoji: '🚶🏻‍♂️',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Parisian Commuter',
            avatarEmoji: '🥖',
            text: 'No human on earth has ever carried a fresh baguette all the way home without eating the crusty tip. It is scientifically impossible.',
            type: 'thought',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'DELICIEUX!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: ['UNESCO Intangible Cultural Heritage Registry: Baguette Culture (2022)', 'Décret n°93-1074 du 13 septembre 1993']
  }
];

// ==========================================
// 4. ROME, ITALY (FCO / CIA)
// ==========================================
export const ROME_COMIC_STORIES: ComicStory[] = [
  // 4a. TONE: ROAST | ERA: 1800s
  {
    id: 'story-rome-roast-1800s',
    placeId: 'poi-roman-forum',
    placeName: 'Roman Forum & Colosseum',
    cityName: 'Rome',
    eraLayer: '1800s',
    tone: 'roast',
    title: 'Cows in the Caesars’ Palace',
    tagline: 'When the mighty capital of the Roman Empire was literally used as a municipal dairy cow pasture.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1840: THE GLORIOUS CENTER OF WORLD POWER...',
        panelScene: 'A cow chewing cud against the Arch of Septimius Severus buried in 5 meters of mud.',
        illustrationEmoji: '🐄',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Roman Farmer',
            avatarEmoji: '🧑🏼‍🌾',
            text: 'Welcome to the "Campo Vaccino" (Cow Field)! Mind the manure near Julius Caesar’s Senate floor!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Grand Tour English Poet',
            avatarEmoji: '🎩',
            text: 'I traveled 2,000 miles to recite Cicero... and a bovine just licked my Latin dictionary.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'MOOO!',
          color: '#10B981',
          rotationDeg: -6
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'ARCHAEOLOGISTS ARRIVE WITH PICKS AND SHOVELS',
        panelScene: 'Excavators uncovering marble inscriptions from centuries of sheep grazing.',
        illustrationEmoji: '⛏️',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Archaeologist',
            avatarEmoji: '🧐',
            text: 'Stop grazing your sheep on the Temple of Saturn! We are uncovering 2,500 years of civilization here!',
            type: 'shout',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Roman Farmer',
            avatarEmoji: '🧑🏼‍🌾',
            text: 'Civilization does not produce fresh ricotta cheese, signore!',
            type: 'speech',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'CLINK!',
          color: '#FF5722',
          rotationDeg: 7
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'TODAY: €18 ENTRY TICKET FOR THE OLD COW PASTURE',
        panelScene: 'Tourists admiring the magnificent excavated marble columns under golden sunlight.',
        illustrationEmoji: '🏛️',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Modern Guide',
            avatarEmoji: '🎙️',
            text: 'And here stood the grand rostrum where Mark Antony spoke... and where Bruno the cow grazed his lunch in 1845.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'BELLISSIMO!',
          color: '#1B3FFF',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Rodolfo Lanciani: Ancient Rome in the Light of Recent Discoveries (1888)', 'Archivio Storico Capitolino']
  },

  // 4b. TONE: PROFESSOR | ERA: 1950s
  {
    id: 'story-rome-prof-1950s',
    placeId: 'poi-cinecitta-trevi',
    placeName: 'Via Veneto & Cinecittà Studios',
    cityName: 'Rome',
    eraLayer: '1950s',
    tone: 'professor',
    title: 'Hollywood on the Tiber & The 11 AM Rule',
    tagline: 'How post-war Cinecittà invented paparazzi, and Italian baristas banned cappuccino after breakfast.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1953: PRODUCTION OF "ROMAN HOLIDAY" AT CINECITTÀ',
        panelScene: 'Gregory Peck and Audrey Hepburn riding a mint-green Vespa 125 down the cobblestones.',
        illustrationEmoji: '🛵',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Prof. Cinema',
            avatarEmoji: '🎬',
            text: 'Due to post-war currency laws, American studios could not repatriate profits out of Italy. Their solution? Spend millions locally filming Roman Holiday and Ben-Hur!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'ROLL CAMERA!',
          color: '#1B3FFF',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'THE BIRTH OF THE "PAPARAZZO" ON VIA VENETO',
        panelScene: 'Scooter photographers with flashbulbs stalking cinema stars outside Café de Paris.',
        illustrationEmoji: '📸',
        illustrationBgColor: '#FEE2E2',
        speechBubbles: [
          {
            speaker: 'Prof. Cinema',
            avatarEmoji: '🎬',
            text: 'In 1958, Federico Fellini named a relentless photographer "Paparazzo" in La Dolce Vita—derived from an Italian dialect word for buzzing mosquitoes.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'FLASH!',
          color: '#F59E0B',
          rotationDeg: 8
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'THE SACRED CULINARY LAW: NO CAPPUCCINO AFTER 11:00 AM',
        panelScene: 'A stern Italian barista gesturing with his hands to a tourist ordering lunch.',
        illustrationEmoji: '☕',
        illustrationBgColor: '#FEF9C3',
        speechBubbles: [
          {
            speaker: 'Barista Gianni',
            avatarEmoji: '👨🏻‍🍳',
            text: 'Signore, it is 13:00! Milk disrupts post-pasta digestion! You drink single espresso shot now or the medical authorities will be called!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'ESPRESSO!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Federico Fellini: Cinecittà Production Diaries (1958)', 'Accademia Italiana della Cucina: Codice del Caffè']
  },

  // 4c. TONE: STORYTELLER | ERA: MODERN
  {
    id: 'story-rome-story-modern',
    placeId: 'poi-metro-line-c',
    placeName: 'Colosseum Station & Metro Line C',
    cityName: 'Rome',
    eraLayer: 'modern',
    tone: 'storyteller',
    title: 'The 2,000-Year Metro Delay',
    tagline: 'Why building a subway in Rome takes 20 years: digging 5 meters uncovers another Roman palace.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'METRO LINE C TUNNEL BORING MACHINE AT 15 METERS DEPTH...',
        panelScene: 'The massive steel boring drill halted before a hidden mosaic floor.',
        illustrationEmoji: '🚇',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Lead Tunnel Engineer',
            avatarEmoji: '👷🏼',
            text: 'Stop the drill! The sensor hit marble again! In London they hit clay, in Paris they hit limestone... in Rome we hit Emperor Hadrian’s dining room.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'HALT!',
          color: '#EF4444',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'THE ARCHAEOLOGICAL RESCUE TEAM DESCENDS WITH LASER SCANNERS',
        panelScene: 'Dusting off a 2nd-century praetorian barracks with intact frescoes.',
        illustrationEmoji: '🏛️',
        illustrationBgColor: '#E0F2FE',
        speechBubbles: [
          {
            speaker: 'State Archaeologist',
            avatarEmoji: '🔬',
            text: 'Incredible! 39 rooms of Emperor Hadrian’s imperial guard barracks! Perfectly preserved under volcanic tuff.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Commuter',
            avatarEmoji: '🎒',
            text: 'Does that mean my train to work will arrive in 2035?',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'DISCOVERY!',
          color: '#3B82F6',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'ROME’S FIRST "ARCHEO-STATION" OPENS TO COMMUTERS',
        panelScene: 'Passengers buying metro tickets next to ancient Roman statues behind bulletproof glass.',
        illustrationEmoji: '🎟️',
        illustrationBgColor: '#DCFCE7',
        speechBubbles: [
          {
            speaker: 'Roman Citizen',
            avatarEmoji: '☕',
            text: 'Where else on earth do you tap your transit card next to an original Roman gladiator bronze? The Eternal City does not rush.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'ETERNO!',
          color: '#10B981',
          rotationDeg: -4
        }
      }
    ],
    sources: ['Soprintendenza Archeologia Belle Arti e Paesaggio di Roma (2024)', 'Metro C Archeo-Station Architecture Report']
  }
];

// ==========================================
// 5. KOZHIKODE / MALABAR COAST (CCJ) — THE HISTORIC KERALA-UAE MARITIME CORRIDOR
// ==========================================
export const KOZHIKODE_COMIC_STORIES: ComicStory[] = [
  // 5a. TONE: PROFESSOR | ERA: 1800s
  {
    id: 'story-kozhikode-prof-1800s',
    placeId: 'poi-beypore-uru',
    placeName: 'Beypore Port & Malabar Spice Bazaar',
    cityName: 'Kozhikode',
    eraLayer: '1800s',
    tone: 'professor',
    title: 'The Master Khalasis of Beypore',
    tagline: 'How master shipwrights built 400-ton wooden dhows without a single blueprint for over 1,500 years.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'THE CHALIYAR RIVER SLIPWAYS: THE BEYPORE URU SHIPYARD',
        panelScene: 'Master carpenter (Mooppan) inspecting giant Nilambur teak logs joined with coir rope.',
        illustrationEmoji: '🪵',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Master Carpenter (Mooppan)',
            avatarEmoji: '🧔🏾‍♂️',
            text: 'We use Nilambur teak and copper rivets. Not a single millimeter is drawn on paper; the entire 40-meter hull geometry is held in the memory of our ancestors.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'CHISEL!',
          color: '#D97706',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'THE KHALASI HEAVY LIFTING PHYSICS',
        panelScene: 'Dozens of Beypore Khalasis hauling the massive wooden hull using traditional wooden rollers (Urulpuli).',
        illustrationEmoji: '🚢',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Prof. Historian',
            avatarEmoji: '👨🏾‍🏫',
            text: 'The Khalasis are world-famous rigging masters. Using human muscle, counterweights, and friction pulleys, they launch 400-ton wooden ships into the Arabian Sea with zero cranes.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'HEAVE HO!',
          color: '#1B3FFF',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'DESTINATION: THE PEARL PORTS OF KHOR DUBAI',
        panelScene: 'The completed Uru sailing west across the Arabian Sea loaded with black pepper and cardamom.',
        illustrationEmoji: '🌊',
        illustrationBgColor: '#DCFCE7',
        speechBubbles: [
          {
            speaker: 'Arab Merchant (Nakhuda)',
            avatarEmoji: '👳🏽‍♂️',
            text: 'This teak hull can withstand 50-knot monsoon storms. We sail with the winter winds directly to Khor Dubai and Kuwait!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'VOYAGE!',
          color: '#10B981',
          rotationDeg: -5
        }
      }
    ],
    sources: ['William Logan’s Malabar Manual (1887)', 'Ibn Battuta’s Rihla (1342 Account of the Calicut Port & Fleet)']
  },

  // 5b. TONE: STORYTELLER | ERA: 1950s
  {
    id: 'story-kozhikode-story-1950s',
    placeId: 'poi-valiyangadi-bazaar',
    placeName: 'Valiyangadi Big Bazaar & The Gulf Corridor',
    cityName: 'Kozhikode',
    eraLayer: '1950s',
    tone: 'storyteller',
    title: 'The 14-Day Monsoon Crossing to Dubai',
    tagline: 'Decades before jumbo jets took off from CCJ airport, Malabar pioneers crossed the Arabian Sea on open dhows.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: '1952: VALIYANGADI WAREHOUSES BEFORE AIRPORTS EXISTED',
        panelScene: 'Sacks of Malabar black pepper, dried ginger, and coir rope stacked high on the dock.',
        illustrationEmoji: '🌶️',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Young Mariner Bava',
            avatarEmoji: '🧔🏾‍♂️',
            text: 'My ticket is a sack of provisions and faith in the stars. 14 days across the Arabian Sea on Captain Hameed’s wooden dhow to Khor Dubai.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'TIE KNOT!',
          color: '#3B82F6',
          rotationDeg: -4
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'NIGHT NAVIGATION UNDER THE DESERT CONSTELLATIONS',
        panelScene: 'Captain using a traditional Kamal wooden card to measure stellar altitude.',
        illustrationEmoji: '✨',
        illustrationBgColor: '#1E293B',
        speechBubbles: [
          {
            speaker: 'Captain Hameed',
            avatarEmoji: '👳🏽‍♂️',
            text: 'Polaris is four fingers above the horizon. The gulf currents are shifting. In two days, we will smell the frankincense of the Arabian coast.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'STARLIGHT!',
          color: '#FBBF24',
          rotationDeg: 5
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'ARRIVAL AT KHOR DUBAI: THE BIRTH OF AN UNBREAKABLE BOND',
        panelScene: 'Dropping anchor at Deira creek alongside fellow traders and friends.',
        illustrationEmoji: '🤝',
        illustrationBgColor: '#FEF9C3',
        speechBubbles: [
          {
            speaker: 'Young Mariner Bava',
            avatarEmoji: '🧔🏾‍♂️',
            text: 'Marhaba! From Kozhikode beach to Dubai Creek, our sweat and spices built a bridge across the ocean that no generation will ever forget.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'ALHAMDULILLAH!',
          color: '#10B981',
          rotationDeg: -3
        }
      }
    ],
    sources: ['K.N. Chaudhuri: Trade and Civilisation in the Indian Ocean', 'Malabar Chamber of Commerce Archives (1953)']
  },

  // 5c. TONE: ROAST | ERA: MODERN
  {
    id: 'story-kozhikode-roast-modern',
    placeId: 'poi-sm-street-halwa',
    placeName: 'SM Street (Sweetmeat Street) & Kozhikode Beach',
    cityName: 'Kozhikode',
    eraLayer: 'modern',
    tone: 'roast',
    title: 'The Sweetmeat Street Sugar Rush',
    tagline: 'When an entire city measures personal honor by how many tons of black wheat halwa you can sample for free.',
    panels: [
      {
        panelNumber: 1,
        narrativeCaption: 'ENTERING SM STREET: THE CAPITAL OF CULINARY GENEROSITY...',
        panelScene: 'Bakers offering free samples of translucent black wheat halwa on banana leaves.',
        illustrationEmoji: '🍯',
        illustrationBgColor: '#FEF3C7',
        speechBubbles: [
          {
            speaker: 'Halwa Master Sankaran',
            avatarEmoji: '👨🏾‍🍳',
            text: 'Namaskaram brother! Taste this tender coconut halwa! No need to buy, just eat half a kilo and tell me if you feel enlightenment!',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Traveler on a Diet',
            avatarEmoji: '🎒',
            text: 'I promised my doctor I would avoid sugar... but this ghee is literally vibrating with joy.',
            type: 'thought',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'SLURP!',
          color: '#FF5722',
          rotationDeg: -5
        }
      },
      {
        panelNumber: 2,
        narrativeCaption: 'THE COCONUT OIL BANANA CHIP CRUNCH TEST',
        panelScene: 'Slicing raw Nendran plantains directly into boiling pure coconut oil cauldrons.',
        illustrationEmoji: '🍌',
        illustrationBgColor: '#FEF9C3',
        speechBubbles: [
          {
            speaker: 'Snack Master',
            avatarEmoji: '👨🏾‍🍳',
            text: 'If your banana chips are not fried in 100% pure Malabar coconut oil within 4 minutes of slicing, are you even living?',
            type: 'speech',
            pointerDirection: 'bottom-left'
          }
        ],
        soundEffect: {
          text: 'SIZZLE!',
          color: '#F59E0B',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: 'BOARDING FLIGHT CCJ ➔ DXB WITH 14 BOXES OF HALWA',
        panelScene: 'Traveler arguing at the airline luggage check-in counter with bulging sweet boxes.',
        illustrationEmoji: '✈️',
        illustrationBgColor: '#DBEAFE',
        speechBubbles: [
          {
            speaker: 'Airline Check-in Agent',
            avatarEmoji: '👩🏽‍💼',
            text: 'Sir, your bag is 9 kilos overweight with Paragon biryani and Kozhikoden halwa.',
            type: 'speech',
            pointerDirection: 'bottom-left'
          },
          {
            speaker: 'Proud Malabari Expat',
            avatarEmoji: '🧔🏾‍♂️',
            text: 'Madam, that is not luggage. That is diplomatic survival food for my colleagues in Dubai!',
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'POYALO!',
          color: '#1B3FFF',
          rotationDeg: -4
        }
      }
    ],
    sources: ['UNESCO Creative Cities Network Dossier: Kozhikode City of Literature (2023)', 'Calicut Heritage Association Records']
  }
];

// ==========================================
// ALL COMIC STORIES AGGREGATED
// ==========================================
export const ALL_COMIC_STORIES: ComicStory[] = [
  ...DUBAI_COMIC_STORIES,
  ...TOKYO_COMIC_STORIES,
  ...PARIS_COMIC_STORIES,
  ...ROME_COMIC_STORIES,
  ...KOZHIKODE_COMIC_STORIES,
  ...EXPANDED_COMIC_STORIES
];

/**
 * Deterministically find the best matching comic story based on city, tone, and era.
 */
export function getComicForCityToneEra(city: string, tone: ComicTone, era: EraLayer): ComicStory {
  const normCity = (city || '').trim().toLowerCase();

  // Filter pool for requested city
  let pool = ALL_COMIC_STORIES;
  if (normCity && normCity !== 'worldwide' && normCity !== 'explore') {
    const matched = ALL_COMIC_STORIES.filter(s => {
      const c = s.cityName.toLowerCase();
      const p = s.placeName.toLowerCase();
      return normCity.includes(c) || c.includes(normCity) || normCity.includes(p) || p.includes(normCity);
    });
    if (matched.length > 0) {
      pool = matched;
    }
  }

  // 1. Exact match on tone and era
  const exact = pool.find(s => s.tone === tone && s.eraLayer === era);
  if (exact) return exact;

  // 2. Tone match in city pool
  const toneMatch = pool.find(s => s.tone === tone);
  if (toneMatch) return toneMatch;

  // 3. Era match in city pool
  const eraMatch = pool.find(s => s.eraLayer === era);
  if (eraMatch) return eraMatch;

  // 4. Fallback to first available in pool
  return pool[0] || DUBAI_COMIC_STORIES[0];
}

/**
 * Backwards compatible helper
 */
export function getComicForSelection(tone: ComicTone, era: EraLayer, city: string = 'Dubai'): ComicStory {
  return getComicForCityToneEra(city, tone, era);
}
