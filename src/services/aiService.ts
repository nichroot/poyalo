import { ItineraryStop, ItineraryDay } from '../types/itinerary';
import { ComicStory, ComicTone, EraLayer } from '../types/comic';
import { getComicForCityToneEra } from '../data/mockComics';
import { CURATED_MYTHS } from '../data/mythData';

export interface GeneratedPlanResponse {
  city: string;
  cityName?: string;
  country: string;
  theme: string;
  totalDays: number;
  days: ItineraryDay[];
  stops: ItineraryStop[];
}

export function getGeminiApiKey(): string {
  try {
    const custom = localStorage.getItem('poyalo_custom_gemini_key');
    if (custom && custom.trim().length > 10) return custom.trim();
  } catch {}
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
}

export function setCustomGeminiApiKey(key: string): void {
  try {
    if (key && key.trim()) {
      localStorage.setItem('poyalo_custom_gemini_key', key.trim());
    } else {
      localStorage.removeItem('poyalo_custom_gemini_key');
    }
  } catch {}
}

interface KnownCityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  themes: string[];
  landmarks: { name: string; category: ItineraryStop['category']; isOutdoor: boolean; idealForSunset?: boolean; notes: string }[];
}

const CITY_DATABASE: Record<string, KnownCityData> = {
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    themes: [
      'Historic Asakusa & Edo Heritage',
      'Cyberpunk Shibuya & Pop Culture',
      'Imperial Gardens & Waterfront Odaiba',
      'Shinjuku Neon & Golden Gai',
      'Ueno Cultural & Museum Trail'
    ],
    landmarks: [
      { name: 'Senso-ji Temple & Nakamise-dori', category: 'heritage', isOutdoor: true, notes: 'Tokyo oldest Buddhist temple founded in 645 AD' },
      { name: 'Tsukiji Outer Market Food Crawl', category: 'food', isOutdoor: true, notes: 'Fresh tamagoyaki, wagyu skewers and sushi' },
      { name: 'Edo-Tokyo Cultural Museum Grounds', category: 'museum', isOutdoor: false, notes: 'Historical models of old Edo shogunate architecture' },
      { name: 'Shibuya Sky 360° Sunset Deck', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Panoramic sunset view over Shibuya Scramble' },
      { name: 'Meiji Jingu Shrine & Forest Walk', category: 'heritage', isOutdoor: true, notes: 'Sacred evergreen forest in the heart of the metropolis' },
      { name: 'Harajuku Takeshita-dori & Cat Street', category: 'souk', isOutdoor: true, notes: 'Vibrant street fashion, artisan coffee and crepes' },
      { name: 'National Museum of Western Art', category: 'museum', isOutdoor: false, notes: 'Le Corbusier UNESCO-listed architecture in Ueno' },
      { name: 'Roppongi Hills Mori Tower Sunset', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Breathtaking view of illuminated Tokyo Tower' },
      { name: 'Imperial Palace East Gardens', category: 'heritage', isOutdoor: true, notes: 'Historic stone castle ruins and Edo moats' },
      { name: 'Akihabara Electric Town', category: 'souk', isOutdoor: true, notes: 'Vintage electronics and retro gaming culture' },
      { name: 'TeamLab Planets Immersive Digital Art', category: 'museum', isOutdoor: false, notes: 'Barefoot walk-through digital light installations' },
      { name: 'Odaiba Seaside Park & Rainbow Bridge', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Tokyo Bay waterfront breeze and golden sunset' }
    ]
  },
  paris: {
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    themes: [
      'Classical Monuments & Historic Seine',
      'Bohemian Montmartre & Art Cafés',
      'Latin Quarter & Luxembourg Gardens',
      'Royal Marais Mansions & Haute Cuisine',
      'Grand Boulevards & Trocadéro Sunset'
    ],
    landmarks: [
      { name: 'Sainte-Chapelle & Île de la Cité', category: 'heritage', isOutdoor: false, notes: '13th-century radiant Gothic stained glass windows' },
      { name: 'Marché des Enfants Rouges Food Market', category: 'food', isOutdoor: true, notes: 'Paris oldest covered food market dating back to 1615' },
      { name: 'Musée d’Orsay Impressionist Masterpieces', category: 'museum', isOutdoor: false, notes: 'Monet, Van Gogh and Degas in a grand railway station' },
      { name: 'Montmartre Sacré-Cœur Sunset Steps', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Overlooking the entire sea of Parisian zinc roofs' },
      { name: 'Louvre Courtyard & Tuileries Garden', category: 'heritage', isOutdoor: true, notes: 'Pei glass pyramid and royal palace promenade' },
      { name: 'Saint-Germain-des-Prés Historic Cafés', category: 'food', isOutdoor: true, notes: 'Sartre and Simone de Beauvoir legendary writing haunts' },
      { name: 'Musée Rodin Sculpture Gardens', category: 'museum', isOutdoor: true, notes: 'The Thinker sculpture surrounded by rose gardens' },
      { name: 'Trocadéro Terrace Sunset over Eiffel Tower', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Golden hour vantage point with hourly light sparkles' }
    ]
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    themes: [
      'Imperial Antiquities & Roman Forum',
      'Baroque Fountains & Historic Piazzas',
      'Vatican Splendors & Trastevere',
      'Appian Way & Catacombs',
      'Capitoline Hills & Sunset Over Tiber'
    ],
    landmarks: [
      { name: 'Colosseum & Roman Forum Sacred Way', category: 'heritage', isOutdoor: true, notes: 'Center of the Roman Empire and gladiatorial arena' },
      { name: 'Campo de’ Fiori Artisan Market', category: 'food', isOutdoor: true, notes: 'Fresh Roman produce, cheeses and Roman pizza al taglio' },
      { name: 'Pantheon & Caravaggio in San Luigi', category: 'heritage', isOutdoor: false, notes: '2,000-year-old unreinforced concrete dome' },
      { name: 'Pincio Terrace Sunset over Piazza del Popolo', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Classic sunset vista looking towards St. Peter’s dome' },
      { name: 'Vatican Museums & Sistine Chapel', category: 'museum', isOutdoor: false, notes: 'Michelangelo ceiling frescoes and Raphael rooms' },
      { name: 'Trastevere Cobblestone Walk & Osterias', category: 'food', isOutdoor: true, notes: 'Authentic cacio e pepe and carbonara in historic alleyways' },
      { name: 'Castel Sant’Angelo Fortress & Bridge', category: 'heritage', isOutdoor: true, notes: 'Hadrian mausoleum overlooking the Tiber River' },
      { name: 'Gianicolo Hill Sunset Panorama', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Highest viewpoint overlooking all seven hills of Rome' }
    ]
  },
  dubai: {
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    themes: [
      'Al Fahidi Heritage & Creek Lore',
      'Modern Skyline & Architectural Wonders',
      'Desert Dunes & Bedouin Traditions',
      'Marina Promenade & Bluewaters Island',
      'Souk Gold & Spice Trade Route'
    ],
    landmarks: [
      { name: 'Al Fahidi Historic District & Wind Towers', category: 'heritage', isOutdoor: true, notes: '19th-century Barajeel passive cooling architecture' },
      { name: 'Spice & Gold Souks Deira', category: 'souk', isOutdoor: true, notes: 'Saffron, frankincense, cardamom and traditional jewelry' },
      { name: 'Dubai Coffee Museum & Cultural Majlis', category: 'museum', isOutdoor: false, notes: 'Traditional Arabic Gahwa roasting and hospitality history' },
      { name: 'Dubai Creek Traditional Abra Sunset Cruise', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Golden hour crossing between Deira and Bur Dubai' },
      { name: 'Museum of the Future Interactive Galleries', category: 'museum', isOutdoor: false, notes: 'Torus architectural masterpiece with Arabic calligraphy' },
      { name: 'Dubai Mall & Downtown Boulevard', category: 'souk', isOutdoor: true, notes: 'Grand atrium with Olympic ice rink and heritage souk' },
      { name: 'Dubai Frame Sky Glass Walkway', category: 'viewpoint', isOutdoor: false, notes: '150-meter bridge bridging Old Dubai and New Dubai' },
      { name: 'Burj Khalifa At The Top Sunset Deck', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'World highest outdoor observation deck on Level 124' }
    ]
  },
  kozhikode: {
    name: 'Kozhikode',
    country: 'India (Malabar Coast)',
    lat: 11.2588,
    lng: 75.7804,
    themes: [
      'Beypore Uru Maritime Shipyards',
      'Sweetmeat Street & Culinary Heritage',
      'Historic Malabar Beach & Sea Pier',
      'Kappad Historic Landing Point',
      'Chaliyar River & Timber Heritage'
    ],
    landmarks: [
      { name: 'Beypore Uru Dhow Shipyards', category: 'heritage', isOutdoor: true, notes: '1,500-year-old tradition of hand-crafting 400-ton teak ships' },
      { name: 'Valiyangadi (Big Bazaar) Spice Warehouses', category: 'souk', isOutdoor: true, notes: 'Historic maritime trading warehouses for Malabar black pepper' },
      { name: 'SM Street (Sweetmeat Street) Halwa Tasting', category: 'food', isOutdoor: true, notes: 'Tasting authentic black wheat halwa and banana chips' },
      { name: 'Kozhikode Beach Sunset & Heritage Pier', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Historic sea bridge ruins with Malabar sea breeze' }
    ]
  },
  amsterdam: {
    name: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    themes: ['Canal Ring Heritage & Jordaan', 'Museumplein Dutch Masters & Vondelpark', 'Historic Dam & Maritime Quarter', 'De Pijp Bohemian Markets & Brown Cafes'],
    landmarks: [
      { name: 'Anne Frank House & Prinsengracht', category: 'heritage', isOutdoor: false, notes: 'Preserved secret annex and wartime historical museum' },
      { name: 'Rijksmuseum Dutch Masters Gallery', category: 'museum', isOutdoor: false, notes: 'Rembrandt Night Watch and Vermeer masterpieces' },
      { name: 'Vondelpark Rose Garden & Historic Pavilions', category: 'heritage', isOutdoor: true, notes: 'Expansive 19th-century public park with cycling avenues' },
      { name: "A'DAM Lookout 360° Sky Sunset Deck", category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Panoramic rooftop view overlooking the historic port and canals' },
      { name: 'Van Gogh Museum Gallery', category: 'museum', isOutdoor: false, notes: 'World largest collection of Vincent van Gogh paintings' },
      { name: 'Albert Cuyp Market Street Food Crawl', category: 'food', isOutdoor: true, notes: 'Fresh warm Dutch stroopwafels, cheeses and pickled herring' },
      { name: 'Dam Square & Royal Palace Amsterdam', category: 'heritage', isOutdoor: true, notes: 'Historic heart of the city and 17th-century town hall' }
    ]
  },
  london: {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    themes: ['Royal Westminster & Thames Embankment', 'Historic City & Tower Fortress', 'Bloomsbury Intellectuals & British Museum', 'South Bank & Greenwich Maritime'],
    landmarks: [
      { name: 'Tower of London & White Tower Armoury', category: 'heritage', isOutdoor: true, notes: 'Nearly 1,000-year-old royal fortress housing the Crown Jewels' },
      { name: 'Borough Market Artisan Food Halls', category: 'food', isOutdoor: true, notes: 'Oldest food market in London dating back to 1014' },
      { name: 'British Museum Parthenon Sculptures', category: 'museum', isOutdoor: false, notes: 'World history and antiquity with the Norman Foster glass Great Court' },
      { name: 'Sky Garden 360° Sunset Panorama', category: 'viewpoint', isOutdoor: false, idealForSunset: true, notes: 'Enclosed public gardens on 35th floor with sunset views over Thames' },
      { name: 'Westminster Abbey & Big Ben Walk', category: 'heritage', isOutdoor: true, notes: 'Coronation site of British monarchs since 1066' },
      { name: 'Covent Garden Piazza & Street Theatre', category: 'souk', isOutdoor: true, notes: 'Historic market building with street performers and boutique crafts' }
    ]
  },
  newyork: {
    name: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.0060,
    themes: ['Manhattan Skyline & Central Park', 'Midtown Art & Broadway Lore', 'Lower Manhattan & Harbor Gateway', 'Greenwich Village & High Line'],
    landmarks: [
      { name: 'Metropolitan Museum of Art (The Met)', category: 'museum', isOutdoor: false, notes: '5,000 years of global art on Fifth Avenue' },
      { name: 'Central Park Bow Bridge & Bethesda Terrace', category: 'heritage', isOutdoor: true, notes: 'Olmsted and Vaux historic urban masterpiece' },
      { name: 'High Line Elevated Rail Park', category: 'viewpoint', isOutdoor: true, notes: 'Repurposed freight rail line through Chelsea art district' },
      { name: 'Top of the Rock Sunset Observation Deck', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Classic sunset vista with Empire State Building centered' },
      { name: 'Chelsea Market & Meatpacking Food Crawl', category: 'food', isOutdoor: false, notes: 'Historic Nabisco factory converted into culinary market' }
    ]
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    lat: 41.3879,
    lng: 2.1699,
    themes: ['Gaudí Modernisme Masterpieces', 'Gothic Quarter & Born Roman Roots', 'Montjuïc Hills & Port Vell', 'Park Güell & Gràcia Bohemian'],
    landmarks: [
      { name: 'Basílica de la Sagrada Família', category: 'heritage', isOutdoor: false, notes: 'Gaudí unfinished architectural masterpiece consecrated by Pope Benedict' },
      { name: 'Mercat de la Boqueria Tapas Crawl', category: 'food', isOutdoor: true, notes: 'Iconic market on La Rambla serving jamón ibérico and seafood' },
      { name: 'Park Güell Mosaic Serpentine Bench', category: 'viewpoint', isOutdoor: true, notes: 'Panoramic overlook across Barcelona towards the Mediterranean' },
      { name: 'Bunkers del Carmel Sunset 360°', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Civil war anti-aircraft bunkers with the best panorama in the city' },
      { name: 'Picasso Museum in El Born Palaces', category: 'museum', isOutdoor: false, notes: 'Formative works of Pablo Picasso in 5 medieval stone palaces' }
    ]
  },
  bangkok: {
    name: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    themes: ['Royal Temples & Chao Phraya River', 'Street Food Capitals & Night Markets', 'Old City Rattanakosin & Canals', 'Modern Skyline & Floating Markets'],
    landmarks: [
      { name: 'Grand Palace & Temple of the Emerald Buddha', category: 'heritage', isOutdoor: true, notes: 'Sacred 18th-century royal complex with dazzling golden spires' },
      { name: 'Wat Pho Giant Reclining Buddha', category: 'heritage', isOutdoor: false, notes: '46-meter gilded Buddha and birthplace of traditional Thai massage' },
      { name: 'Yaowarat Chinatown Street Food Crawl', category: 'food', isOutdoor: true, notes: 'World-famous stir-fried crab curry, crispy pork, and mango sticky rice' },
      { name: 'Wat Arun Temple of Dawn Sunset', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Iconic porcelain-encrusted prang glowing over the river at dusk' },
      { name: 'Chatuchak Weekend Artisan Market', category: 'souk', isOutdoor: true, notes: 'Over 15,000 stalls of vintage textiles, silks, and regional spices' },
      { name: 'Jim Thompson House & Silk Museum', category: 'museum', isOutdoor: false, notes: 'Traditional teak compound housing historic Southeast Asian antiquities' }
    ]
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    themes: ['Supertrees & Futuristic Botanical Gardens', 'Chinatown & Kampong Glam Heritage', 'Hawker Culinary Culture & Marina Bay', 'Colonial Civic District & Riverfront'],
    landmarks: [
      { name: 'Gardens by the Bay & Flower Dome', category: 'heritage', isOutdoor: false, notes: 'Futuristic conservatories and towering vertical plant gardens' },
      { name: 'Chinatown Heritage Centre & Buddha Tooth Relic', category: 'heritage', isOutdoor: true, notes: 'Rich Peranakan history and four-story Tang-style temple' },
      { name: 'Lau Pa Sat Hawker Center & Satay Street', category: 'food', isOutdoor: true, notes: 'Victorian cast-iron pavilion serving Hainanese chicken rice and charcoal satay' },
      { name: 'Marina Bay Sands SkyPark Observation Deck', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Panoramic sunset view over Marina Bay, Singapore Strait, and city skyline' },
      { name: 'National Gallery Singapore', category: 'museum', isOutdoor: false, notes: 'Historic City Hall and Supreme Court housing Southeast Asian modern art' }
    ]
  },
  istanbul: {
    name: 'Istanbul',
    country: 'Türkiye',
    lat: 41.0082,
    lng: 28.9784,
    themes: ['Byzantine & Ottoman Imperial Wonders', 'Bosphorus Maritime Crossing & Kadıköy', 'Grand Bazaar & Historic Spice Route', 'Galata Bohemian Alleys & Karaköy'],
    landmarks: [
      { name: 'Hagia Sophia Grand Mosque', category: 'heritage', isOutdoor: false, notes: 'Sixth-century Byzantine cathedral with soaring dome and golden mosaics' },
      { name: 'Topkapi Palace & Imperial Harem', category: 'museum', isOutdoor: true, notes: 'Ottoman sultans’ royal residence overlooking the Golden Horn' },
      { name: 'Grand Bazaar & Egyptian Spice Market', category: 'souk', isOutdoor: false, notes: '4,000 historic vaulted shops with Turkish delights, carpets, and ceramics' },
      { name: 'Galata Tower 360° Sunset Panorama', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Medieval Genoese stone tower catching golden light over historic peninsula' },
      { name: 'Basilica Cistern Subterranean Sanctuary', category: 'heritage', isOutdoor: false, notes: 'Ancient underground Roman water reservoir with 336 marble columns' }
    ]
  },
  cairo: {
    name: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    themes: ['Giza Necropolis & Ancient Pharaohs', 'Islamic Cairo & Historic Minarets', 'Grand Egyptian Museum & Nile Breezes', 'Coptic Enclave & Khan el-Khalili'],
    landmarks: [
      { name: 'Great Pyramids of Giza & Sphinx', category: 'heritage', isOutdoor: true, notes: 'The only surviving wonder of the ancient world' },
      { name: 'Grand Egyptian Museum (GEM)', category: 'museum', isOutdoor: false, notes: 'State-of-the-art museum housing the full Tutankhamun collection' },
      { name: 'Khan el-Khalili Medieval Bazaar', category: 'souk', isOutdoor: true, notes: '14th-century labyrinth of brass lanterns, copper goods, and spice merchants' },
      { name: 'Mokattam Mountain Sunset Over Cairo', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Panoramic sunset with minarets and pyramids silhouetted in the distance' }
    ]
  },
  kyoto: {
    name: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    themes: ['Zen Temples & Torii Forest Trails', 'Gion Geisha Heritage & Tea Houses', 'Arashiyama Bamboo Grove & Rivers', 'Imperial Palaces & Kaiseki Culture'],
    landmarks: [
      { name: 'Fushimi Inari-taisha 10,000 Torii Gates', category: 'heritage', isOutdoor: true, notes: 'Iconic vermilion shrine path winding through sacred Mount Inari forest' },
      { name: 'Kinkaku-ji (Golden Pavilion)', category: 'heritage', isOutdoor: true, notes: 'Zen Buddhist temple covered in pure gold leaf reflecting over Mirror Pond' },
      { name: 'Nishiki Market 400-Year Food Street', category: 'food', isOutdoor: false, notes: 'Kyoto kitchen: fresh yuba, grilled octopus skewers, and matcha dango' },
      { name: 'Kiyomizu-dera Wooden Stage Sunset', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Ancient temple veranda built without nails overlooking Kyoto valley' },
      { name: 'Arashiyama Bamboo Grove Walk', category: 'heritage', isOutdoor: true, notes: 'Soaring emerald bamboo stems rustling in the mountain breeze' }
    ]
  },
  venice: {
    name: 'Venice',
    country: 'Italy',
    lat: 45.4408,
    lng: 12.3155,
    themes: ['Grand Canal & Venetian Palazzi', 'St. Mark Square & Doge Antiquities', 'Rialto Bridges & Cicchetti Taverns', 'Lagoon Islands Murano & Burano'],
    landmarks: [
      { name: 'St. Mark’s Basilica & Campanile', category: 'heritage', isOutdoor: false, notes: 'Byzantine domes and dazzling gold-ground mosaics' },
      { name: 'Doge’s Palace & Bridge of Sighs', category: 'museum', isOutdoor: false, notes: 'Gothic seat of the Venetian Republic and historic prisons' },
      { name: 'Rialto Market & Traditional Cicchetti Crawl', category: 'food', isOutdoor: true, notes: 'Centuries-old lagoon seafood market and cozy neighborhood bàcari' },
      { name: 'Grand Canal Accademia Bridge Sunset', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Classic postcard golden-hour vista towards Santa Maria della Salute' }
    ]
  },
  berlin: {
    name: 'Berlin',
    country: 'Germany',
    lat: 52.5200,
    lng: 13.4050,
    themes: ['Cold War Lore & Reunified Icons', 'Museum Island Prussian Treasures', 'Kreuzberg Street Art & Food Markets', 'Tiergarten & Spree Riverfront'],
    landmarks: [
      { name: 'Brandenburg Gate & Pariser Platz', category: 'heritage', isOutdoor: true, notes: '18th-century neoclassical monument and symbol of German reunification' },
      { name: 'Museum Island & Pergamon Panorama', category: 'museum', isOutdoor: false, notes: 'UNESCO heritage island complex with Prussian antiquities' },
      { name: 'Markthalle Neun Street Food Thursday', category: 'food', isOutdoor: false, notes: 'Historic 19th-century market hall in Kreuzberg serving artisan regional bites' },
      { name: 'Reichstag Glass Dome Sunset Vista', category: 'viewpoint', isOutdoor: false, idealForSunset: true, notes: 'Norman Foster spiraling glass dome overlooking the parliamentary quarter' }
    ]
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    themes: ['Sydney Harbour & Architectural Icons', 'The Rocks Historic Convict Quarters', 'Bondi Coastal Walks & Ocean Beaches', 'Barangaroo & Darling Harbour'],
    landmarks: [
      { name: 'Sydney Opera House & Forecourt Walk', category: 'heritage', isOutdoor: true, notes: 'Jørn Utzon UNESCO masterpiece with sail-like roof shells' },
      { name: 'The Rocks Historic Convict Market', category: 'souk', isOutdoor: true, notes: 'Oldest colonial cobblestone streets, artisan crafts, and historic pubs' },
      { name: 'Sydney Fish Market Oyster Tasting', category: 'food', isOutdoor: true, notes: 'Third largest fish market in the world with freshly shucked oysters' },
      { name: 'Sydney Harbour Bridge Pylon Sunset Lookout', category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Panoramic golden hour sunset over Sydney Harbour and Opera House' }
    ]
  }
};

export function generateDeterministicPlan(userPrompt: string): GeneratedPlanResponse {
  const norm = userPrompt.toLowerCase();

  // 1. Detect city
  let cityKey = Object.keys(CITY_DATABASE).find(k => norm.includes(k));
  let cityInfo: KnownCityData;

  if (cityKey && CITY_DATABASE[cityKey]) {
    cityInfo = CITY_DATABASE[cityKey];
  } else {
    // Extract guessed city name from prompt
    const words = userPrompt.split(/[\s,]+/);
    const stopWords = ['a', 'the', 'in', 'at', 'to', 'for', 'and', 'with', 'plan', 'trip', 'tour', 'visit', 'days', 'day', 'weekend', 'explore', 'vacation', 'holiday', 'itinerary', 'travel'];
    const candidates = words.filter(w => w.length > 2 && !stopWords.includes(w.toLowerCase()));
    const guessedName = candidates[0] ? candidates[0].charAt(0).toUpperCase() + candidates[0].slice(1).toLowerCase() : 'Global Destination';

    cityInfo = {
      name: guessedName,
      country: 'Worldwide',
      lat: 40.0,
      lng: 10.0,
      themes: [
        `${guessedName} Historic Core & Heritage Trail`,
        `${guessedName} Artisan Quarter & Local Flavors`,
        `${guessedName} Modern Arts & Scenic Heights`,
        `${guessedName} Coastal Promenade & Garden Walk`,
        `${guessedName} Hidden Alleys & Farewell Vista`
      ],
      landmarks: [
        { name: `${guessedName} Old Town & Citadel Gate`, category: 'heritage', isOutdoor: true, notes: 'Ancient preserved architecture and cobblestone lanes' },
        { name: `${guessedName} Central Artisan & Spice Market`, category: 'souk', isOutdoor: true, notes: 'Bustling local vendors, crafts, and street delicacies' },
        { name: `${guessedName} National Cultural Museum`, category: 'museum', isOutdoor: false, notes: 'Historical masterpieces and archaeological artifacts' },
        { name: `${guessedName} Panoramic Skyline Lookout`, category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Spectacular golden-hour sunset over the city rooftops' },
        { name: `${guessedName} Botanical Royal Gardens`, category: 'heritage', isOutdoor: true, notes: 'Historic pavilions and peaceful tree-lined paths' },
        { name: `${guessedName} Riverside Promenade & Cafés`, category: 'food', isOutdoor: true, notes: 'Authentic regional lunch dishes and local drinks' },
        { name: `${guessedName} Contemporary Gallery Quarter`, category: 'museum', isOutdoor: false, notes: 'Interactive modern art and design installations' },
        { name: `${guessedName} Hilltop Sanctuary Sunset`, category: 'viewpoint', isOutdoor: true, idealForSunset: true, notes: 'Elevated viewpoint catching the twilight city lights' }
      ]
    };
  }

  // 2. Detect duration
  let daysCount = 3;
  if (norm.includes('1 day') || norm.includes('one day')) daysCount = 1;
  else if (norm.includes('2 day') || norm.includes('two day') || norm.includes('weekend')) daysCount = 2;
  else if (norm.includes('4 day') || norm.includes('four day')) daysCount = 4;
  else if (norm.includes('5 day') || norm.includes('five day')) daysCount = 5;

  // 3. Build days
  const days: ItineraryDay[] = [];
  const landmarks = cityInfo.landmarks;

  for (let d = 0; d < daysCount; d++) {
    const dayLandmarks = [
      landmarks[(d * 4) % landmarks.length],
      landmarks[(d * 4 + 1) % landmarks.length],
      landmarks[(d * 4 + 2) % landmarks.length],
      landmarks[(d * 4 + 3) % landmarks.length]
    ];

    const times = [
      { start: '09:30', end: '11:00', dur: 90 },
      { start: '11:30', end: '13:00', dur: 90 },
      { start: '14:30', end: '16:30', dur: 120 },
      { start: '17:30', end: '19:15', dur: 105 }
    ];

    const stops: ItineraryStop[] = dayLandmarks.map((lm, idx) => ({
      id: `stop-${d + 1}-${Date.now()}-${idx}`,
      poiId: `poi-${lm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: lm.name,
      category: lm.category,
      startTime: times[idx].start,
      endTime: times[idx].end,
      durationMinutes: times[idx].dur,
      lat: Number((cityInfo.lat + (idx * 0.008) - 0.012).toFixed(4)),
      lng: Number((cityInfo.lng + (idx * 0.008) - 0.012).toFixed(4)),
      isOutdoor: lm.isOutdoor,
      idealForSunset: Boolean(lm.idealForSunset),
      notes: lm.notes
    }));

    days.push({
      dayNumber: d + 1,
      theme: cityInfo.themes[d % cityInfo.themes.length] || `Day ${d + 1} Discovery`,
      stops
    });
  }

  return {
    city: cityInfo.name,
    cityName: cityInfo.name,
    country: cityInfo.country,
    theme: `${cityInfo.name} Cultural & Heritage Trail`,
    totalDays: daysCount,
    days,
    stops: days[0]?.stops || []
  };
}

export async function generateAIPlan(userPrompt: string): Promise<GeneratedPlanResponse> {
  // 1. Try Vercel / serverless endpoint first
  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, apiKey: getGeminiApiKey() })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.days?.length > 0 || data.stops?.length > 0)) {
        const totalDays = data.totalDays || data.days?.length || 1;
        const normalizedDays: ItineraryDay[] = (data.days && data.days.length > 0)
          ? data.days.map((d: any, dIdx: number) => ({
              dayNumber: d.dayNumber || dIdx + 1,
              theme: d.theme || `Day ${dIdx + 1} Exploration`,
              stops: (d.stops || []).map((s: any, idx: number) => ({
                id: `ai-stop-${dIdx + 1}-${Date.now()}-${idx}`,
                poiId: `poi-${(s.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
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
          city: data.city || data.cityName || 'Custom Destination',
          cityName: data.city || data.cityName || 'Custom Destination',
          country: data.country || 'Worldwide',
          theme: data.theme || 'Curated Exploration Trail',
          totalDays: totalDays,
          days: normalizedDays,
          stops: normalizedDays[0]?.stops || []
        };
      }
    }
  } catch {
    // Fall through to client direct engine
  }

  // 2. Direct Gemini Call (if a custom or default key is provided)
  const apiKey = getGeminiApiKey();
  if (apiKey && apiKey.length > 10) {
    try {
      const systemPrompt = `You are an elite travel planner for POYALO.
The traveler requested: "${userPrompt}".
Identify the destination city, country, and duration requested (e.g. "3 days in Tokyo" -> 3 days, "weekend in Amsterdam" -> 2 days, or if unspecified default to 2 to 3 days). Maximum 5 days.
CRITICAL INSTRUCTION: You MUST use REAL, SPECIFIC, FAMOUS, and AUTHENTIC places, landmarks, museums, street markets, viewpoints, and neighborhood food spots for this exact destination (e.g. for Amsterdam: Anne Frank House, Rijksmuseum, Vondelpark, Dam Square, Albert Cuyp Market). NEVER use generic placeholder names like "Old Town Gate" or "Central Market". Every place must be a real verified location with accurate coordinates.

Return ONLY a valid JSON object matching this schema:
{
  "city": "Name of City",
  "country": "Name of Country",
  "theme": "Overall Trip Title",
  "totalDays": 2,
  "days": [
    {
      "dayNumber": 1,
      "theme": "Day 1 Theme",
      "stops": [
        {
          "name": "Specific Real Landmark Name",
          "category": "heritage" | "souk" | "museum" | "food" | "viewpoint",
          "startTime": "09:30",
          "endTime": "11:00",
          "durationMinutes": 90,
          "lat": 52.3600,
          "lng": 4.8852,
          "isOutdoor": true,
          "idealForSunset": false,
          "notes": "Authentic highlight or local tip"
        }
      ]
    }
  ]
}`;

      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];
      let parsedJson: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.5
                }
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
              const resJson = JSON.parse(textContent);
              if (resJson && (resJson.days?.length > 0 || resJson.stops?.length > 0)) {
                parsedJson = resJson;
                break;
              }
            }
          }
        } catch {
          // Try next model
        }
      }

      if (parsedJson) {
        const totalDays = parsedJson.totalDays || parsedJson.days?.length || 1;
        const normalizedDays: ItineraryDay[] = (parsedJson.days && parsedJson.days.length > 0)
          ? parsedJson.days.map((d: any, dIdx: number) => ({
              dayNumber: d.dayNumber || dIdx + 1,
              theme: d.theme || `Day ${dIdx + 1} Trail`,
              stops: (d.stops || []).map((s: any, idx: number) => ({
                id: `ai-stop-${dIdx + 1}-${Date.now()}-${idx}`,
                poiId: `poi-${(s.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
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
          : [];

        return {
          city: parsedJson.city || parsedJson.cityName || 'Custom Destination',
          cityName: parsedJson.city || parsedJson.cityName || 'Custom Destination',
          country: parsedJson.country || 'Worldwide',
          theme: parsedJson.theme || 'Curated Exploration Trail',
          totalDays: totalDays,
          days: normalizedDays,
          stops: normalizedDays[0]?.stops || []
        };
      }
    } catch {
      // Gracefully fall through
    }
  }

  // 3. Fallback: Always returns a complete, beautiful plan in <10ms
  return generateDeterministicPlan(userPrompt);
}

export function generateDeterministicComicStory(
  placeOrCity: string,
  tone: ComicTone,
  era: EraLayer
): ComicStory {
  // First, check verified repository
  const existing = getComicForCityToneEra(placeOrCity, tone, era);
  if (existing && existing.cityName.toLowerCase() === placeOrCity.toLowerCase()) {
    return existing;
  }

  const cleanName = placeOrCity.charAt(0).toUpperCase() + placeOrCity.slice(1);
  const eraTitle = era === '1800s' ? '19th Century Origins' : era === '1950s' ? 'Mid-Century Rebirth' : 'Modern Metropolis';

  return {
    id: `comic-det-${Date.now()}`,
    placeId: `poi-${placeOrCity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    placeName: `${cleanName} Historic Quarter`,
    cityName: cleanName,
    eraLayer: era,
    tone: tone,
    title: `${cleanName}: ${eraTitle}`,
    tagline: `An illustrated adventure through the secret lore and vibrant history of ${cleanName}.`,
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
            speaker: 'Explorer',
            avatarEmoji: '😋',
            text: `Incredible! You can never find this authenticity in tourist guidebooks.`,
            type: 'shout',
            pointerDirection: 'bottom-right'
          }
        ],
        soundEffect: {
          text: 'DELICIOUS!',
          color: '#FF5722',
          rotationDeg: 6
        }
      },
      {
        panelNumber: 3,
        narrativeCaption: `SUNSET VISTA OVER ${cleanName.toUpperCase()}`,
        panelScene: `Golden hour light descending over the magnificent architecture.`,
        illustrationEmoji: '🌅',
        illustrationBgColor: '#DCFCE7',
        speechBubbles: [
          {
            speaker: 'Local Guide',
            avatarEmoji: '🧭',
            text: `As twilight falls, the true magic of ${cleanName} awakens. Shall we go further?`,
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

export async function generateAIComicStory(
  placeOrCity: string,
  tone: ComicTone,
  era: EraLayer
): Promise<ComicStory> {
  const apiKey = getGeminiApiKey();

  if (apiKey && apiKey.length > 10) {
    try {
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

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
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

      if (response.ok) {
        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          if (parsed && parsed.panels && parsed.panels.length > 0) {
            return {
              id: `ai-comic-${Date.now()}`,
              placeId: `poi-${placeOrCity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              placeName: placeOrCity,
              cityName: parsed.cityName || placeOrCity,
              eraLayer: era,
              tone: tone,
              title: parsed.title || `${placeOrCity} Story`,
              tagline: parsed.tagline || 'An illustrated journey into local history.',
              panels: parsed.panels,
              sources: parsed.sources || ['Local Historical Archives']
            };
          }
        }
      }
    } catch {
      // Fall through to deterministic comic engine
    }
  }

  // Guaranteed deterministic comic engine (NEVER fails)
  return generateDeterministicComicStory(placeOrCity, tone, era);
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

export function generateDeterministicMyths(destinationName: string): GeneratedMythItem[] {
  // Check curated myths
  const norm = destinationName.trim().toLowerCase();
  const matchedKey = Object.keys(CURATED_MYTHS).find(k => k.toLowerCase() === norm || norm.includes(k.toLowerCase()));

  if (matchedKey && CURATED_MYTHS[matchedKey]) {
    return CURATED_MYTHS[matchedKey].map(m => ({ ...m }));
  }

  const clean = destinationName.charAt(0).toUpperCase() + destinationName.slice(1);

  return [
    {
      id: `myth-${Date.now()}-1`,
      city: clean,
      country: 'Worldwide',
      category: 'humans',
      categoryLabel: 'People & Hospitality',
      emoji: '🤝',
      myth: `Locals in ${clean} are cold towards foreign visitors who do not speak the local language fluently.`,
      reality: `Residents in ${clean} deeply appreciate visitors who make the effort to learn even basic polite greetings like "Hello" and "Thank you". Modesty and patience open warm doors.`,
      insiderTip: `Learn 3 polite phrases in the local dialect; it immediately transforms transactional interactions into genuine smiles.`,
      severity: 'fun'
    },
    {
      id: `myth-${Date.now()}-2`,
      city: clean,
      country: 'Worldwide',
      category: 'food',
      categoryLabel: 'Dining Traditions',
      emoji: '🍲',
      myth: `Eating well in ${clean} requires booking expensive luxury restaurants weeks in advance.`,
      reality: `The most authentic and unforgettable flavors in ${clean} are found in humble neighborhood family bistros, markets, and street counters where locals eat daily.`,
      insiderTip: `Avoid venues directly facing major monument plazas with multi-language picture menus. Walk two streets back into residential alleys for real home cooking.`,
      severity: 'medium'
    },
    {
      id: `myth-${Date.now()}-3`,
      city: clean,
      country: 'Worldwide',
      category: 'monuments',
      categoryLabel: 'Landmark Realities',
      emoji: '🏛️',
      myth: `You can easily buy tickets at the monument entrance counter without reserving ahead.`,
      reality: `Major attractions in ${clean} enforce strict timed-entry slots to protect historic architecture. Walk-in queues can exceed 2.5 hours or be completely sold out.`,
      insiderTip: `Reserve official entry tickets online 10 to 14 days before your trip. Select the earliest morning slot (09:00) to enjoy the sights before tour bus crowds arrive.`,
      severity: 'high'
    },
    {
      id: `myth-${Date.now()}-4`,
      city: clean,
      country: 'Worldwide',
      category: 'traditional',
      categoryLabel: 'Customs & Etiquette',
      emoji: '💡',
      myth: `Tipping generously with cash at tables is required everywhere in ${clean}.`,
      reality: `Service charges and staff wages in ${clean} are typically integrated directly into menu pricing. Over-tipping can occasionally cause polite confusion.`,
      insiderTip: `Rounding up the bill to the nearest note or leaving small pocket change is standard practice and deeply appreciated.`,
      severity: 'fun'
    }
  ];
}

export async function generateAIMyths(destinationName: string): Promise<GeneratedMythItem[]> {
  const apiKey = getGeminiApiKey();

  if (apiKey && apiKey.length > 10) {
    try {
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
    "categoryLabel": "Short category title",
    "emoji": "Single emoji",
    "myth": "The common false belief (1-2 sentences)",
    "reality": "The authentic local reality (2 sentences)",
    "insiderTip": "Actionable advice (1-2 sentences)",
    "severity": "high" | "medium" | "fun"
  }
]`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
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

      if (response.ok) {
        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          const items = Array.isArray(parsed) ? parsed : parsed.myths || [];
          if (items.length > 0) {
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
        }
      }
    } catch {
      // Fall through to deterministic myth engine
    }
  }

  // Guaranteed deterministic myths engine (NEVER fails)
  return generateDeterministicMyths(destinationName);
}
