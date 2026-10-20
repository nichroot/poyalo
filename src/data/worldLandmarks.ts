export interface WorldLandmark {
  id: string;
  name: string;
  category: 'iconic' | 'heritage' | 'nature' | 'interactive' | 'leisure';
  district: string;
  emoji: string;
  description: string;
  coords: { x: number; y: number; z: number };
  color: string;
  badge: string;
  tags: string[];
}

export const WORLD_LANDMARKS: WorldLandmark[] = [
  {
    id: 'burj-khalifa',
    name: 'Burj Khalifa Spire',
    category: 'iconic',
    district: 'Downtown Spire District',
    emoji: '🏙️',
    description: "The world's tallest building at 828m, towering over Downtown Dubai with reflective stepped spires and futuristic summit needle.",
    coords: { x: 28, y: 0.6, z: -55 },
    color: '#38BDF8',
    badge: "WORLD'S TALLEST",
    tags: ['burj', 'khalifa', 'tower', 'skyscraper', 'downtown', 'spire', 'tall']
  },
  {
    id: 'museum-future',
    name: 'Museum of the Future',
    category: 'iconic',
    district: 'Innovation Boulevard',
    emoji: '🔮',
    description: 'Stainless steel torus-shaped architectural marvel adorned with Arabic calligraphy poetry windows.',
    coords: { x: -35, y: 0.6, z: 15 },
    color: '#A855F7',
    badge: 'TIME MACHINE',
    tags: ['museum', 'future', 'torus', 'arabic', 'poetry', 'innovation', 'ring']
  },
  {
    id: 'burj-al-arab',
    name: 'Burj Al Arab Island',
    category: 'iconic',
    district: 'Jumeirah Coast',
    emoji: '⛵',
    description: 'Iconic 321m sail-shaped 7-star resort standing on a private man-made offshore island with a helipad.',
    coords: { x: 40, y: 0.6, z: 25 },
    color: '#0D9488',
    badge: '7-STAR LUXURY',
    tags: ['burj', 'arab', 'sail', 'island', 'jumeirah', 'beach', 'hotel']
  },
  {
    id: 'dubai-frame',
    name: 'Dubai Frame Portal',
    category: 'iconic',
    district: 'Zabeel Cultural Axis',
    emoji: '🖼️',
    description: 'Monumental 150m golden picture frame visually bridging historical Old Dubai with futuristic downtown.',
    coords: { x: -25, y: 0.6, z: -35 },
    color: '#D4AF37',
    badge: 'GOLDEN PORTAL',
    tags: ['frame', 'gold', 'zabeel', 'bridge', 'skyline', 'portal']
  },
  {
    id: 'ain-dubai',
    name: 'Ain Dubai Ferris Wheel',
    category: 'iconic',
    district: 'Bluewaters Coastline',
    emoji: '🎡',
    description: 'The monumental 250m observation wheel with slowly rotating observation pods overlooking the sea.',
    coords: { x: 55, y: 0.6, z: 50 },
    color: '#EC4899',
    badge: 'COASTAL WHEEL',
    tags: ['ain', 'wheel', 'ferris', 'bluewaters', 'observation', 'sea']
  },
  {
    id: 'arch-bridge',
    name: 'Grand Arch Causeway Bridge',
    category: 'heritage',
    district: 'Khor Dubai Crossing',
    emoji: '🌉',
    description: 'Sweeping timber causeway arching 3.6m over the creek, connecting Old Town with the Modern Marina.',
    coords: { x: 26, y: 3.6, z: 0 },
    color: '#F59E0B',
    badge: 'CREEK CROSSING',
    tags: ['bridge', 'causeway', 'creek', 'wood', 'crossing', 'arch']
  },
  {
    id: 'al-fahidi-observatory',
    name: 'Wind-Tower Rooftop Observatory',
    category: 'heritage',
    district: 'Al Fahidi Historic District',
    emoji: '🏺',
    description: 'Ancient coral-stone Barjeel wind-tower complex with a climbable wooden ramp and elevated lookout deck.',
    coords: { x: -16, y: 5.8, z: -18 },
    color: '#B45309',
    badge: 'ROOFTOP VIEW',
    tags: ['fahidi', 'windtower', 'rooftop', 'barjeel', 'heritage', 'observatory', 'ramp']
  },
  {
    id: 'spice-gold-souk',
    name: 'Spice & Gold Souk Bazaar',
    category: 'heritage',
    district: 'Old Deira Quarter',
    emoji: '🧄',
    description: 'Bustling covered market alleyways lined with striped fabric awnings, brass lanterns, and spice sacks.',
    coords: { x: -6, y: 0.6, z: 28 },
    color: '#EA580C',
    badge: 'TRADITIONAL SOUK',
    tags: ['souk', 'spice', 'gold', 'bazaar', 'market', 'deira', 'canopy', 'sikka']
  },
  {
    id: 'abra-pier',
    name: 'Creek Abra Water Taxi Pier',
    category: 'heritage',
    district: 'Bur Dubai Quayside',
    emoji: '🛶',
    description: 'Quayside wooden dock where traditional motorized abras ferry travelers across the sparkling creek.',
    coords: { x: 8.5, y: 0.6, z: -18 },
    color: '#0284C7',
    badge: 'WATER TAXI',
    tags: ['abra', 'boat', 'water', 'pier', 'creek', 'taxi', 'dock']
  },
  {
    id: 'desert-camp',
    name: 'Desert Dune Bedouin Camp',
    category: 'nature',
    district: 'Western Desert Dunes',
    emoji: '⛺',
    description: 'Traditional nomadic desert camp nestled in red sand dunes with woven tent, campfire glow, and camel hitch.',
    coords: { x: -48, y: 0.6, z: -55 },
    color: '#D97706',
    badge: 'OASIS CAMP',
    tags: ['desert', 'dune', 'camp', 'bedouin', 'oasis', 'tent', 'fire', 'sand']
  },
  {
    id: 'qasba-canal',
    name: 'Al Qasba Waterfront Canal',
    category: 'leisure',
    district: 'Al Qasba Cultural District',
    emoji: '🛶',
    description: 'Venetian-style turquoise canal spanned by twin pedestrian footbridges, waterfront café terraces, and Moorish pavilion.',
    coords: { x: -30, y: 0.6, z: 65 },
    color: '#06B6D4',
    badge: 'CANAL PROMENADE',
    tags: ['qasba', 'canal', 'venetian', 'bridges', 'sharjah', 'waterfront', 'cafe', 'promenade']
  },
  {
    id: 'miracle-oasis',
    name: 'Miracle Floral Oasis & Fountain',
    category: 'nature',
    district: 'Botanical Promenade',
    emoji: '🌸',
    description: 'Tranquil garden oasis with tiered stone water fountain, colorful blossom arches, and stone rest benches.',
    coords: { x: 50, y: 0.6, z: -35 },
    color: '#10B981',
    badge: 'GARDEN OASIS',
    tags: ['miracle', 'garden', 'oasis', 'fountain', 'flowers', 'park', 'water']
  },
  {
    id: 'bounce-arena',
    name: 'Mega Trampoline Bounce Pad',
    category: 'interactive',
    district: 'Stunt & Adventure Plaza',
    emoji: '🦘',
    description: 'High-power pneumatic spring pad that launches players 17 meters straight up into the comic sky!',
    coords: { x: -8, y: 0.6, z: 12 },
    color: '#F59E0B',
    badge: 'MEGA LAUNCH',
    tags: ['bounce', 'trampoline', 'jump', 'stunt', 'launch', 'arena']
  },
  {
    id: 'speed-highway',
    name: 'Supersonic Speed Booster',
    category: 'interactive',
    district: 'Bridge High-Speed Trail',
    emoji: '⚡',
    description: 'Cyan kinetic power strip that supercharges sprint velocity by 1.8x for 3.2 seconds.',
    coords: { x: 26, y: 3.6, z: 0 },
    color: '#06B6D4',
    badge: '1.8X SPEED',
    tags: ['speed', 'boost', 'fast', 'accelerator', 'pad', 'run']
  }
];
