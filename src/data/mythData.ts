export interface TravelMyth {
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

export const CURATED_MYTHS: Record<string, TravelMyth[]> = {
  'Dubai': [
    {
      id: 'dxb-1',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'humans',
      categoryLabel: 'People & Society',
      emoji: '🏎️',
      myth: 'Everyone in Dubai is an Emirati billionaire driving gold-plated supercars.',
      reality: 'Over 85% of Dubai\'s population consists of everyday working expats from 200+ nations. Most residents take the spotless Dubai Metro and drive standard Japanese sedans.',
      insiderTip: 'Emiratis are known for warm hospitality. If invited for Gahwa (Arabic coffee) and dates, always receive the cup with your right hand.',
      severity: 'fun'
    },
    {
      id: 'dxb-2',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'traditional',
      categoryLabel: 'Culture & Nightlife',
      emoji: '🍹',
      myth: 'Alcohol is completely illegal and you cannot enjoy evening nightlife.',
      reality: 'Hundreds of licensed lounges, beach clubs, rooftop bars, and Michelin-starred venues operate legally across hotels and designated tourist zones.',
      insiderTip: 'Public drunkenness or disorderly street conduct has strictly zero tolerance. Enjoy within licensed venues and use taxis to travel.',
      severity: 'medium'
    },
    {
      id: 'dxb-3',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'monuments',
      categoryLabel: 'Burj Khalifa & Landmarks',
      emoji: '🏗️',
      myth: 'The Burj Khalifa has no sewage pipes and requires endless trucks to empty it daily.',
      reality: 'This is a viral urban myth from a brief 2009 opening delay. The Burj Khalifa has been directly connected to Dubai\'s modern municipal sewerage network for over a decade.',
      insiderTip: 'Book level 124+ tickets online at least 10 days early for 17:30 sunset slots to avoid paying double walk-in surge pricing.',
      severity: 'fun'
    },
    {
      id: 'dxb-4',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'traditional',
      categoryLabel: 'Dress Code & Customs',
      emoji: '👗',
      myth: 'Female travelers must wear full abayas and cover their hair at all times.',
      reality: 'Normal contemporary modest clothing (shorts, t-shirts, summer dresses, swimwear at pools) is standard everywhere across malls, streets, and resorts.',
      insiderTip: 'Modest dress (shoulders and knees covered, hair scarf) is only required when visiting religious mosques like the Grand Mosque, where complimentary abayas are provided.',
      severity: 'high'
    },
    {
      id: 'dxb-5',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'food',
      categoryLabel: 'Dining & Etiquette',
      emoji: '🪙',
      myth: 'Gold leaf steaks and expensive hotel buffets are the only food available.',
      reality: 'Old Dubai (Deira & Karama) is a legendary street food paradise where you can get authentic Pakistani nihari, Iranian kebabs, or fresh shawarma for under $3-$5.',
      insiderTip: 'Cross the Dubai Creek on a traditional wooden Abra boat for just 1 AED (~$0.27) to visit the Spice and Gold Souks.',
      severity: 'fun'
    }
  ],
  'Tokyo': [
    {
      id: 'tyo-1',
      city: 'Tokyo',
      country: 'Japan',
      category: 'traditional',
      categoryLabel: 'Tipping & Etiquette',
      emoji: '💴',
      myth: 'Leaving a generous 15-20% cash tip at restaurants shows deep respect.',
      reality: 'Tipping does not exist in Japan and is considered confusing or even insulting. Excellent service is standard and built into the price.',
      insiderTip: 'If you leave cash on the table, waitstaff will sprint down the street after you to return the money you accidentally "forgot"!',
      severity: 'high'
    },
    {
      id: 'tyo-2',
      city: 'Tokyo',
      country: 'Japan',
      category: 'humans',
      categoryLabel: 'People & Interaction',
      emoji: '🤝',
      myth: 'Japanese people are cold and deliberately avoid talking to foreign visitors.',
      reality: 'Japanese culture is deeply rooted in "Omotenashi" (mindful hospitality). Locals may hesitate to speak simply out of modesty or shyness regarding their English skills.',
      insiderTip: 'Use a translation app and start with polite phrases like "Sumimasen" (Excuse me) or "Arigato gozaimasu" (Thank you)—doors will open instantly.',
      severity: 'fun'
    },
    {
      id: 'tyo-3',
      city: 'Tokyo',
      country: 'Japan',
      category: 'traditional',
      categoryLabel: 'Public Spaces',
      emoji: '🗑️',
      myth: 'Tokyo streets are spotless because trash cans are placed on every street corner.',
      reality: 'There are virtually NO public trash cans in Tokyo (removed after the 1995 subway incident). Citizens carry their rubbish home in their daypacks.',
      insiderTip: 'Always carry a small plastic bag in your bag to hold your trash until you return to your hotel or find a convenience store recycling bin.',
      severity: 'medium'
    },
    {
      id: 'tyo-4',
      city: 'Tokyo',
      country: 'Japan',
      category: 'food',
      categoryLabel: 'Dining on a Budget',
      emoji: '🍱',
      myth: 'Eating well in Tokyo requires a huge budget and reservations months ahead.',
      reality: 'Convenience stores (7-Eleven, Lawson, FamilyMart) and conveyor belt sushi joints offer Michelin-grade quality onigiri, egg sandwiches, and bento for under $4-$7.',
      insiderTip: 'Visit department store basement food halls ("depachika") after 19:30 for 30% to 50% discount stickers on gourmet bento boxes.',
      severity: 'fun'
    }
  ],
  'Rome': [
    {
      id: 'rom-1',
      city: 'Rome',
      country: 'Italy',
      category: 'food',
      categoryLabel: 'Culinary Traditions',
      emoji: '☕',
      myth: 'Ordering a cappuccino after a heavy pasta dinner is standard practice.',
      reality: 'Italians strictly drink milky coffee (cappuccino, latte) only before 11:00 AM. After lunch or dinner, they only order plain espresso ("un caffè") to aid digestion.',
      insiderTip: 'Never ask for grated parmesan cheese on seafood pasta—Italian chefs consider mixing dairy and fresh fish a cardinal culinary sin.',
      severity: 'medium'
    },
    {
      id: 'rom-2',
      city: 'Rome',
      country: 'Italy',
      category: 'monuments',
      categoryLabel: 'Ancient Monuments',
      emoji: '🏛️',
      myth: 'The Roman Colosseum was built entirely by chained amateur slaves.',
      reality: 'While Jewish captives provided heavy labor, the structure was engineered and erected by highly organized, paid Roman union guilds and master masonry engineers.',
      insiderTip: 'Fill your water bottle for free at any of Rome\'s 2,500+ ancient street fountains ("nasoni")—the mountain spring water is ice-cold and 100% potable.',
      severity: 'fun'
    },
    {
      id: 'rom-3',
      city: 'Rome',
      country: 'Italy',
      category: 'safety',
      categoryLabel: 'Tourist Traps',
      emoji: '🍝',
      myth: 'Any restaurant with laminated pictures of pasta outside is authentic traditional trattoria.',
      reality: 'Restaurants displaying photos of food, multilingual menus outside, or waiters begging you to enter are classic tourist traps serving frozen pre-made dishes.',
      insiderTip: 'Look for spots packed with local Italian elders, menus written in Italian that change daily, and tucked 2-3 alleys away from the main piazzas.',
      severity: 'high'
    }
  ],
  'Paris': [
    {
      id: 'par-1',
      city: 'Paris',
      country: 'France',
      category: 'humans',
      categoryLabel: 'Locals & Etiquette',
      emoji: '🥖',
      myth: 'Parisians are inherently rude and hostile to English-speaking travelers.',
      reality: 'Parisians adhere to a strict social code: walking into a store or asking for directions without saying "Bonjour Madame/Monsieur" is considered rude. If you greet first, service is lovely.',
      insiderTip: 'Always say "Bonjour" first before asking a question in English. It instantly transforms your interaction.',
      severity: 'high'
    },
    {
      id: 'par-2',
      city: 'Paris',
      country: 'France',
      category: 'food',
      categoryLabel: 'Water & Dining',
      emoji: '💧',
      myth: 'You must pay €8 for bottled mineral water at cafes because tap water isn\'t served.',
      reality: 'By French law, every restaurant must provide free, chilled municipal tap water upon request. Eau de Paris is among Europe\'s highest-quality drinking waters.',
      insiderTip: 'Confidently ask for "Une carafe d\'eau, s\'il vous plaît" (a carafe of tap water) and save your money for dessert.',
      severity: 'fun'
    },
    {
      id: 'par-3',
      city: 'Paris',
      country: 'France',
      category: 'monuments',
      categoryLabel: 'The Louvre',
      emoji: '🖼️',
      myth: 'You can easily see the Mona Lisa and tour the entire Louvre museum in one afternoon.',
      reality: 'The Louvre covers 73,000 square meters with over 35,000 artworks. Spending 30 seconds on each piece would take over 100 continuous days!',
      insiderTip: 'Enter via the Carrousel du Louvre underground entrance instead of the main glass pyramid line to skip 45-minute security queues.',
      severity: 'medium'
    }
  ],
  'Bangkok': [
    {
      id: 'bkk-1',
      city: 'Bangkok',
      country: 'Thailand',
      category: 'food',
      categoryLabel: 'Street Food Safety',
      emoji: '🍲',
      myth: 'Eating from street food carts will inevitably give you severe food poisoning.',
      reality: 'Street food vendors cook at scorching wok temperatures with ingredients bought fresh each morning from morning wet markets. Turnover is often much higher than hotel buffets.',
      insiderTip: 'Eat where local Thai office workers and school kids queue up. High turnaround means fresh, sizzling ingredients.',
      severity: 'medium'
    },
    {
      id: 'bkk-2',
      city: 'Bangkok',
      country: 'Thailand',
      category: 'safety',
      categoryLabel: 'Tuk-Tuk Scams',
      emoji: '🛺',
      myth: 'A friendly local outside a temple telling you "The Grand Palace is closed today for Buddha Day" is just being helpful.',
      reality: 'This is Bangkok\'s most infamous scam! The Palace is almost never closed. They will steer you into a 20-Baht tuk-tuk that detours to high-pressure gem and suit shops.',
      insiderTip: 'Ignore friendly strangers near temple gates and walk straight to the official ticket counter yourself.',
      severity: 'high'
    },
    {
      id: 'bkk-3',
      city: 'Bangkok',
      country: 'Thailand',
      category: 'traditional',
      categoryLabel: 'Sacred Customs',
      emoji: '🧘',
      myth: 'Touching a monk\'s shoulder or pointing your feet at a Buddha statue is harmless.',
      reality: 'In Thai Theravada Buddhism, feet are considered spiritually lowest and the head is the most sacred. Pointing feet at monks or Buddha statues is considered deeply offensive.',
      insiderTip: 'When sitting in temples, tuck your feet behind you or sit cross-legged with soles pointed away from the altar.',
      severity: 'high'
    }
  ],
  'London': [
    {
      id: 'lon-1',
      city: 'London',
      country: 'United Kingdom',
      category: 'traditional',
      categoryLabel: 'Tube Commuting Code',
      emoji: '🚇',
      myth: 'You can casually stand on either side of the London Underground escalator.',
      reality: 'Standing on the left side of a Tube escalator is a violation of London\'s sacred unwritten commuting code! The left is strictly for walking.',
      insiderTip: 'Always stand on the RIGHT, walk on the LEFT. Violating this will earn you immediate sharp sighs and "Excuse me, please!"',
      severity: 'high'
    },
    {
      id: 'lon-2',
      city: 'London',
      country: 'United Kingdom',
      category: 'food',
      categoryLabel: 'British Cuisine',
      emoji: '🥧',
      myth: 'British cuisine is bland, boiled, and among the worst in the world.',
      reality: 'London is today one of the world\'s premier culinary capitals, renowned for modern British gastronomy, Sunday roasts with Yorkshire puddings, and Borough Market artisans.',
      insiderTip: 'Visit Brick Lane or Tooting for world-class curries, or an authentic Victorian pub for a Sunday roast with beef and rich gravy.',
      severity: 'fun'
    },
    {
      id: 'lon-3',
      city: 'London',
      country: 'United Kingdom',
      category: 'monuments',
      categoryLabel: 'Big Ben & Landmarks',
      emoji: '🕰️',
      myth: 'The giant clock tower next to the British Parliament is officially named Big Ben.',
      reality: 'The tower is named Elizabeth Tower. "Big Ben" is solely the nickname of the 13.7-tonne Great Bell inside that rings the hour!',
      insiderTip: 'London\'s world-renowned museums (British Museum, Natural History Museum, Tate Modern) are 100% free of charge to enter.',
      severity: 'fun'
    }
  ],
  'Kozhikode': [
    {
      id: 'koz-1',
      city: 'Kozhikode',
      country: 'India (Malabar Coast)',
      category: 'humans',
      categoryLabel: 'Hospitality & Honesty',
      emoji: '🛺',
      myth: 'Auto-rickshaw drivers in Indian cities always overcharge tourists and refuse meters.',
      reality: 'Kozhikode auto drivers are legendary across India for strict honesty: they automatically turn on the digital meter, return forgotten items, and happily recommend the best local eateries.',
      insiderTip: 'Pay the exact metered fare; rounding up is welcomed, but drivers take genuine pride in transparent fares and will hand back exact change.',
      severity: 'fun'
    },
    {
      id: 'koz-2',
      city: 'Kozhikode',
      country: 'India (Malabar Coast)',
      category: 'food',
      categoryLabel: 'Malabar Biryani & Sulaimani',
      emoji: '🍚',
      myth: 'All Indian biryani is overwhelmingly fiery red and uses long basmati rice.',
      reality: 'Authentic Kozhikode/Thalassery Biryani is made with fragrant short-grain Khaima (Jeerakasala) rice, gentle spices, pure ghee, fried cashews, and raisins. It is celebrated for delicate aroma rather than chili heat.',
      insiderTip: 'Order authentic mutton or chicken biryani at Paragon or Rahmath, and conclude your feast with a piping-hot Sulaimani (black spiced tea with mint).',
      severity: 'fun'
    },
    {
      id: 'koz-3',
      city: 'Kozhikode',
      country: 'India (Malabar Coast)',
      category: 'traditional',
      categoryLabel: 'SM Street & Halwa Lore',
      emoji: '🍯',
      myth: 'SM Street (Sweetmeat Street) is just a standard shopping market.',
      reality: 'Mittayi Theruvu has been an active pedestrian trading alley since the Zamorin era, where sweetmakers cooked translucent black wheat halwa in coconut oil for Arab and European merchants for over 500 years.',
      insiderTip: 'Walk through Sankaran Bakery on SM Street for free tastings of authentic tender coconut and black halwa served on fresh banana leaves.',
      severity: 'fun'
    }
  ],

  'Amsterdam': [
    {
      id: 'ams-1',
      city: 'Amsterdam',
      country: 'Netherlands',
      category: 'safety',
      categoryLabel: 'Bicycle Hegemony & Traffic',
      emoji: '🚲',
      myth: 'Bicycle lanes are just casual scenic paths where pedestrians have the right of way.',
      reality: 'Bikes rule Amsterdam with unyielding priority. Walking into the red-asphalt fietspad without checking will earn you frantic bell chimes and harsh Dutch scolding. Cyclists do not stop for wandering tourists.',
      insiderTip: 'Stay firmly on the sidewalk pavement (gray tiles), never walk on the reddish-brown asphalt bike paths, and look both ways twice before crossing.',
      severity: 'high'
    },
    {
      id: 'ams-2',
      city: 'Amsterdam',
      country: 'Netherlands',
      category: 'traditional',
      categoryLabel: 'Cannabis & Public Laws',
      emoji: '🌿',
      myth: 'Marijuana is completely legal everywhere and you can smoke on any street corner.',
      reality: 'Cannabis is technically "tolerated" (gedoogbeleid) only within licensed coffeeshops. Smoking weed in public streets—especially throughout the City Center and Red Light District—is strictly illegal and subject to on-the-spot fines.',
      insiderTip: 'Respect designated consumption zones inside licensed venues and do not consume cannabis openly on public bridges or canal steps.',
      severity: 'medium'
    },
    {
      id: 'ams-3',
      city: 'Amsterdam',
      country: 'Netherlands',
      category: 'humans',
      categoryLabel: 'Dutch Directness',
      emoji: '🗣️',
      myth: 'Dutch locals are deliberately rude and dismissive.',
      reality: 'The Dutch practice "bespreekbaarheid"—radical honesty and directness. If your idea is impractical or you are in their way, they will tell you plainly without sugarcoating. It is considered efficient and respectful, not rude.',
      insiderTip: 'Do not take direct bluntness personally. Feel free to be straightforward and clear in return; they appreciate brevity.',
      severity: 'fun'
    }
  ],

  'New York': [
    {
      id: 'nyc-1',
      city: 'New York',
      country: 'United States',
      category: 'food',
      categoryLabel: 'Municipal Water & Bagels',
      emoji: '🥯',
      myth: 'New York City tap water is murky and requires bottled water for everything.',
      reality: 'NYC has some of the highest-rated municipal drinking water in the nation, piped untreated and pristine directly from the Catskill and Delaware mountain reservoirs. This mineral profile is the secret behind the legendary texture of NYC bagels and pizza dough!',
      insiderTip: 'Save your money and skip bottled water—carry a reusable flask and refill from any city tap or restaurant.',
      severity: 'fun'
    },
    {
      id: 'nyc-2',
      city: 'New York',
      country: 'United States',
      category: 'safety',
      categoryLabel: 'Street Safety & The Subway',
      emoji: '🚇',
      myth: 'The NYC subway is an unnavigable danger zone where tourists should never travel at night.',
      reality: 'Millions of everyday New Yorkers commute on the MTA 24/7. While common-sense street awareness is necessary, key lines in Manhattan and Brooklyn are bustling and equipped with OMNY contactless tap-and-go gates at all stations.',
      insiderTip: 'Never enter an empty subway car during peak rush hour—there is always a pungent reason it is completely vacant.',
      severity: 'medium'
    },
    {
      id: 'nyc-3',
      city: 'New York',
      country: 'United States',
      category: 'traditional',
      categoryLabel: 'Sidewalk Etiquette',
      emoji: '🚶🏻',
      myth: 'You can casually stop in the middle of Manhattan sidewalks to gaze up at skyscrapers.',
      reality: 'New York sidewalks are high-speed commuter highways. Abruptly freezing mid-step to take photos causes immediate pedestrian gridlock and draws intense exasperation from locals.',
      insiderTip: 'Step to the outer building wall or storefront entrance before pulling out your smartphone or checking maps.',
      severity: 'fun'
    }
  ],

  'Barcelona': [
    {
      id: 'bcn-1',
      city: 'Barcelona',
      country: 'Spain',
      category: 'food',
      categoryLabel: 'Dining Times & Sangria',
      emoji: '🥘',
      myth: 'Locals drink Sangria every night and sit down for dinner at 6:00 PM.',
      reality: 'Pitchers of sangria with fruit slices are almost exclusively sold to tourists. Locals drink Vermut (red vermouth with an olive) for aperitif and Cava or wine with meals. Authentic restaurant kitchens rarely open before 8:30 or 9:00 PM.',
      insiderTip: 'Have a "merienda" (late afternoon snack) around 5 PM, and book dinner reservations between 9:00 PM and 10:00 PM to eat with the locals.',
      severity: 'fun'
    },
    {
      id: 'bcn-2',
      city: 'Barcelona',
      country: 'Spain',
      category: 'safety',
      categoryLabel: 'Pickpocketing & La Rambla',
      emoji: '⚠️',
      myth: 'Barcelona has violent street muggings around every corner.',
      reality: 'Violent crime in Barcelona is extremely low. However, professional distraction pickpocketing around Las Ramblas, Sagrada Família, and metro transfer corridors is among the highest in Europe.',
      insiderTip: 'Never leave your phone or sunglasses sitting on an outdoor cafe table, and keep your bag zipped and slung across your chest on the metro.',
      severity: 'high'
    },
    {
      id: 'bcn-3',
      city: 'Barcelona',
      country: 'Spain',
      category: 'traditional',
      categoryLabel: 'Catalan Culture & Language',
      emoji: '💛',
      myth: 'Barcelona is culturally identical to Madrid or Seville.',
      reality: 'Barcelona is the proud capital of Catalonia, with its own co-official Romance language (Catalan), distinct architectural heritage, and separate cultural traditions (like the human towers of Castells).',
      insiderTip: 'Greeting shopkeepers with "Bon dia" (Good day) instead of "Buenos días" is warmly appreciated by locals.',
      severity: 'fun'
    }
  ],

  'Singapore': [
    {
      id: 'sin-1',
      city: 'Singapore',
      country: 'Singapore',
      category: 'traditional',
      categoryLabel: 'Chewing Gum Law',
      emoji: '🍬',
      myth: 'Chewing a piece of gum will land you in a Singaporean prison cell immediately.',
      reality: 'The law bans the commercial import and sale of chewing gum to prevent vandalism on MRT train door sensors. Possessing a small personal pack for chewing is not a crime, nor is therapeutic nicotine or dental gum.',
      insiderTip: 'Never spit gum or litter onto the street—public cleanliness fines are strictly enforced and start at SGD $300.',
      severity: 'fun'
    },
    {
      id: 'sin-2',
      city: 'Singapore',
      country: 'Singapore',
      category: 'food',
      categoryLabel: 'Hawker Centers vs Expensive Restaurants',
      emoji: '🍜',
      myth: 'Singapore is an ultra-expensive tax haven where food costs a fortune.',
      reality: 'While luxury hotels are pricey, Singapore\'s UNESCO-listed Hawker Centers (Maxwell, Chinatown Complex, Lau Pa Sat) serve some of the best culinary dishes on the planet for just SGD $4 to $7 per plate.',
      insiderTip: 'If you see an empty table with a packet of pocket tissues, an umbrella, or an office lanyard on it, it has been "choped" (reserved). Respect the reservation!',
      severity: 'fun'
    }
  ],

  'Istanbul': [
    {
      id: 'ist-1',
      city: 'Istanbul',
      country: 'Turkey',
      category: 'traditional',
      categoryLabel: 'Capital City & Modern Dress',
      emoji: '🕌',
      myth: 'Istanbul is the capital of Turkey and women must wear full head coverings everywhere.',
      reality: 'Ankara has been the political capital of Turkey since 1923. Istanbul is a secular, cosmopolitan metropolis where modern dress (jeans, skirts, t-shirts) is ubiquitous. Headscarves are only required when stepping inside active religious mosques like Hagia Sophia or Blue Mosque.',
      insiderTip: 'Carry a lightweight scarf in your day bag so you can easily enter imperial mosques without having to borrow public visitor robes.',
      severity: 'medium'
    },
    {
      id: 'ist-2',
      city: 'Istanbul',
      country: 'Turkey',
      category: 'traditional',
      categoryLabel: 'Street Animals & Society',
      emoji: '🐈',
      myth: 'Stray cats and dogs in Istanbul are pests that the municipality exterminates.',
      reality: 'Istanbul\'s street cats and dogs are cherished communal citizens. Under Turkish animal protection laws, they are sterilized, vaccinated with ear tags, fed with neighborhood kibble stations, and provided with wooden shelter huts by residents.',
      insiderTip: 'Petting friendly street cats in cafes or parks is a beloved local pastime. They are remarkably gentle and accustomed to affection.',
      severity: 'fun'
    }
  ],

  'Cairo': [
    {
      id: 'cai-1',
      city: 'Cairo',
      country: 'Egypt',
      category: 'monuments',
      categoryLabel: 'Pyramids of Giza Location',
      emoji: '🏜️',
      myth: 'The Great Pyramids are isolated hundreds of miles out in an empty, uninhabited desert.',
      reality: 'The Giza plateau sits directly adjacent to suburban Cairo. You can view the Sphinx while sitting on the rooftop terrace of a Pizza Hut or local kebab restaurant across the avenue!',
      insiderTip: 'Arrive at the ticket gate right at 8:00 AM opening to explore the plateau before the midday Cairo sun and tour bus crowds arrive.',
      severity: 'fun'
    },
    {
      id: 'cai-2',
      city: 'Cairo',
      country: 'Egypt',
      category: 'traditional',
      categoryLabel: 'Touts & Camel Rides',
      emoji: '🐫',
      myth: 'You must pay whatever camel guides or souvenir vendors quote you at the plateau.',
      reality: 'Official camel ride tariffs are legally fixed by the Ministry of Tourism. Persistent touts will quote 5x the rate or demand exorbitant tips to help you dismount.',
      insiderTip: 'Book official rides inside the gate through the government ticketing window, or firmly say "La, Shukran" (No, thank you) with polite eye contact and keep walking.',
      severity: 'medium'
    }
  ],

  'Kyoto': [
    {
      id: 'kyo-1',
      city: 'Kyoto',
      country: 'Japan',
      category: 'traditional',
      categoryLabel: 'Geiko & Maiko Etiquette',
      emoji: '👘',
      myth: 'You can stop Geishas in Gion for selfies or follow them down residential alleys.',
      reality: 'Chasing or touching Geiko and Maiko is considered severe harassment ("Geisha paparazzi"). The Gion district has instituted strict bans on photography in private streets, with active fines of ¥10,000.',
      insiderTip: 'If you spot a Maiko walking to an appointment, admire respectfully from a distance and keep your camera lowered.',
      severity: 'high'
    },
    {
      id: 'kyo-2',
      city: 'Kyoto',
      country: 'Japan',
      category: 'monuments',
      categoryLabel: 'Temple Shoes & Tatami',
      emoji: '👟',
      myth: 'You can wear your walking shoes throughout Buddhist temple compounds and gardens.',
      reality: 'Inside temple main halls and wooden verandas, all shoes must be removed and placed in shoe cubbies or carried in plastic bags to preserve centuries-old cedar floors and tatami mats.',
      insiderTip: 'Wear clean, slip-on shoes with comfortable, intact socks when exploring Kyoto—you will be taking them off a dozen times a day.',
      severity: 'fun'
    }
  ],

  'Venice': [
    {
      id: 'vce-1',
      city: 'Venice',
      country: 'Italy',
      category: 'monuments',
      categoryLabel: 'Canal Odor & Lagoon Tides',
      emoji: '🌊',
      myth: 'Venice canals permanently smell like raw open sewers throughout the year.',
      reality: 'The Adriatic Sea tides naturally flush and cleanse the Venetian lagoon twice every 24 hours. A faint organic marsh scent only occasionally surfaces during sluggish low tides on peak 35°C summer afternoons.',
      insiderTip: 'Spring and Autumn offer the freshest air, crystalline lagoon reflections, and pleasant strolling temperatures.',
      severity: 'fun'
    },
    {
      id: 'vce-2',
      city: 'Venice',
      country: 'Italy',
      category: 'traditional',
      categoryLabel: 'Gondola vs Vaporetto',
      emoji: '🛶',
      myth: 'You must pay €100+ for a gondola to get across the Grand Canal.',
      reality: 'Gondolas are scenic leisure experiences (€90 per 30 mins official rate). For daily crossing, locals use the "Traghetto"—large shared wooden gondolas rowed by two oarsmen that ferry you across the Grand Canal for just €2.00!',
      insiderTip: 'Stand up balance-style during your €2 Traghetto crossing like a true Venetian commuter.',
      severity: 'fun'
    }
  ],

  'Berlin': [
    {
      id: 'ber-1',
      city: 'Berlin',
      country: 'Germany',
      category: 'humans',
      categoryLabel: 'Berliner Schnauze',
      emoji: '🐻',
      myth: 'Berliners are unfriendly and grumpy toward visitors.',
      reality: 'Locals practice "Berliner Schnauze"—a distinct sharp-witted, sarcastic banter with a heart of gold. What sounds like annoyance is actually affectionate working-class humor.',
      insiderTip: 'Don\'t be afraid to crack a dry joke back. If you respect the queuing system and cross streets at green pedestrian lights (Ampelmännchen), you will be treated like family.',
      severity: 'fun'
    },
    {
      id: 'ber-2',
      city: 'Berlin',
      country: 'Germany',
      category: 'traditional',
      categoryLabel: 'Sunday Shopping & Cash',
      emoji: '💶',
      myth: 'You can go shopping at supermarkets and use credit cards everywhere anytime.',
      reality: 'Under German federal law (Ladenschlussgesetz), virtually all supermarkets, boutiques, and retail stores are legally required to close on Sundays. Furthermore, many beloved Spätis, bakeries, and currywurst stands still accept cash only.',
      insiderTip: 'Always carry €20 to €40 in physical euro banknotes, and buy your groceries on Saturday before 8 PM.',
      severity: 'medium'
    }
  ],

  'Sydney': [
    {
      id: 'syd-1',
      city: 'Sydney',
      country: 'Australia',
      category: 'safety',
      categoryLabel: 'Deadly Wildlife Reality',
      emoji: '🕷️',
      myth: 'You will encounter venomous funnel-web spiders and deadly snakes in your Sydney hotel room.',
      reality: 'Urban and coastal Sydney is pristine and modern. Anti-venom for funnel-webs has been available since 1981 with zero fatalities since its introduction. Major beaches have shark nets and active drone lifeguards.',
      insiderTip: 'The real wildlife danger in spring is the Australian Magpie swooping near park trees to protect its nest. Walk calmly and wear sunglasses or a hat.',
      severity: 'fun'
    },
    {
      id: 'syd-2',
      city: 'Sydney',
      country: 'Australia',
      category: 'traditional',
      categoryLabel: 'Australia\'s Capital City',
      emoji: '🏛️',
      myth: 'Sydney is the capital city of Australia.',
      reality: 'Canberra is the national capital, chosen in 1908 as a compromise between rival cities Sydney and Melbourne!',
      insiderTip: 'Catch the public F1 Manly Ferry from Circular Quay for an iconic $8 harbour cruise with postcard views of the Opera House and Harbour Bridge.',
      severity: 'fun'
    }
  ]
};

export const POPULAR_DESTINATIONS = [
  { name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { name: 'Paris', country: 'France', flag: '🇫🇷' },
  { name: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Kozhikode', country: 'India (Malabar)', flag: '🇮🇳' },
  { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'New York', country: 'United States', flag: '🇺🇸' },
  { name: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { name: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { name: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
  { name: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
  { name: 'Venice', country: 'Italy', flag: '🇮🇹' },
  { name: 'Berlin', country: 'Germany', flag: '🇩🇪' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺' }
];
