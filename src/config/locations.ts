import { LocationZone, TrackInfo } from '../types';

export const LOCATIONS: LocationZone[] = [
  {
    id: 'tapri',
    name: 'Sharma Ji Ki Chai Tapri',
    hindiName: 'शर्मा जी की चाय टपरी',
    tagline: 'Cutting Chai & Acoustic Melodies',
    category: 'Street Corner',
    description: 'A roadside wooden tea stall with boiling cardamom ginger chai in brass kettles, bun maska, and a cozy bench under fairy lights.',
    culturalDetail: 'The heartbeat of Indian street conversations — endless debates, newspapers, hot samosas, and soulful indie tunes.',
    playlistId: 'PLKY03nOAYUfU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLKY03nOAYUfU',
    videoIds: [
      '1e3gpVn7gN4', // Chaudhary - Mame Khan & Amit Trivedi
      'fSS_R91Nimw', // Iktara - Wake Up Sid
      'T94PHkuydcw', // Kun Faya Kun - A.R. Rahman
      'p010G3x5xNw', // Baarishein - Anuv Jain
      'kxyT0nKq_2k', // Kasoor - Prateek Kuhad
    ],
    icon: 'Coffee',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    position: { x: -14, y: 0, z: 12 },
    radius: 9,
    hasInterior: true,
    interiorSpawn: { x: -15.9, y: 1.30, z: 13.4, yaw: Math.PI * 0.7, seatHeight: 0.10 },
    actionPrompt: 'Grab a hot cutting chai on the tapri bench',
    ambientProfile: { type: 'tapri', intensity: 0.75 },
    sampleTracks: [
      { id: 't1', title: 'Chaudhary (Acoustic)', artist: 'Mame Khan & Amit Trivedi', mood: 'Soulful Rustic' },
      { id: 't2', title: 'Iktara (Chai Session)', artist: 'Kavita Seth & Tochi Raina', mood: 'Nostalgic Indie' },
      { id: 't3', title: 'Kun Faya Kun (Unplugged)', artist: 'A.R. Rahman', mood: 'Spiritual Serenity' },
      { id: 't4', title: 'Baarishein (Acoustic)', artist: 'Anuv Jain', mood: 'Rainy Monsoon' },
      { id: 't5', title: 'Kasoor', artist: 'Prateek Kuhad', mood: 'Warm Evening' },
    ]
  },
  {
    id: 'barber',
    name: "New Bharat Men's Salon",
    hindiName: 'न्यू भारत मेन्स सैलून व स्पा',
    tagline: 'Head Massage & 90s/2000s Bollywood Hits',
    category: 'Commercial Shop',
    description: 'An authentic neighborhood barber shop with red hydraulic swivel chairs, full-wall mirrors, talcum powder clouds, and classic radio nostalgia.',
    culturalDetail: 'Famous for the world-renowned Indian head massage (champi), sandalwood face creams, and the best local gossip.',
    playlistId: 'PLKwXuUgwrQR0',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLKwXuUgwrQR0',
    videoIds: [
      'PQmrmVs10X8', // Chaiyya Chaiyya - Sukhwinder Singh
      '8jL1S9P7c9Y', // Pehla Nasha - Udit Narayan & Sadhana Sargam
      'gQJvJb1yM0o', // Suraj Hua Maddham - Sonu Nigam
      'Cb6wuzOurPc', // Tum Se Hi - Mohit Chauhan
      '2bipV_f_vbw', // Zara Sa - KK
      'cNV5hLKh98s', // Tujhe Dekha Toh - DDLJ
    ],
    icon: 'Scissors',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    position: { x: -28, y: 0, z: -18 },
    radius: 10,
    hasInterior: true,
    interiorSpawn: { x: -29.8, y: 1.62, z: -19.8, yaw: Math.PI, seatHeight: 0.41 },
    actionPrompt: 'Sit in the barber chair for a champi & classic melody',
    ambientProfile: { type: 'salon', intensity: 0.65 },
    sampleTracks: [
      { id: 'b1', title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh & Sapna Awasthi', mood: 'High Energy' },
      { id: 'b2', title: 'Pehla Nasha', artist: 'Udit Narayan & Sadhana Sargam', mood: 'Golden 90s' },
      { id: 'b3', title: 'Suraj Hua Maddham', artist: 'Sonu Nigam & Alka Yagnik', mood: 'Romantic Melodrama' },
      { id: 'b4', title: 'Tum Se Hi', artist: 'Mohit Chauhan & Pritam', mood: 'Feel-Good Monsoon' },
      { id: 'b5', title: 'Zara Sa', artist: 'KK & Pritam', mood: 'Nostalgia Rush' },
    ]
  },
  {
    id: 'truck',
    name: 'National Permit Truck "Raja"',
    hindiName: 'ऑल इंडिया परमिट ट्रक "राजा"',
    tagline: 'Highway Dhaba & Punjabi Folk Beats',
    category: 'Highway Heavy Vehicle',
    description: 'A 10-wheeler decorated Tata truck with radiant hand-painted peacock art, "HORN OK PLEASE", dangling evil-eye lemons, and a cabin draped in velvet.',
    culturalDetail: 'The nomadic kings of the Grand Trunk Road — carrying goods with loud horns, colorful shayari, and booming bass.',
    playlistId: 'PLKY03nOAYUfU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLKY03nOAYUfU',
    videoIds: [
      'vTIIMJ9tUc8', // Tunak Tunak Tun - Daler Mehndi
      'kJQP7kiw5Fk', // Balle Balle - Gurdas Maan
      'T8sQ6uX7m1s', // Daku - Chani Nattan
      '7m_qDdfk_mY', // Patiala Peg - Diljit Dosanjh
      'bg7T7vQ1i48', // Amplifier - Imran Khan
    ],
    icon: 'Truck',
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    position: { x: 26, y: 0, z: 18 },
    radius: 9,
    hasInterior: true,
    interiorSpawn: { x: 24.3, y: 2.37, z: 19.8, yaw: -Math.PI * 0.15, seatHeight: 1.18 },
    actionPrompt: 'Climb into the truck cabin and take the wheel',
    ambientProfile: { type: 'highway', intensity: 0.8 },
    sampleTracks: [
      { id: 'tr1', title: 'Tunak Tunak Tun', artist: 'Daler Mehndi', mood: 'Peak Bhangra' },
      { id: 'tr2', title: 'Balle Balle (GT Road Express)', artist: 'Gurdas Maan', mood: 'Pure Folk' },
      { id: 'tr3', title: 'Daku (Highway Bass)', artist: 'Chani Nattan & Inderpal Moga', mood: 'Booming Bass' },
      { id: 'tr4', title: 'Patiala Peg', artist: 'Diljit Dosanjh', mood: 'Celebration Drive' },
      { id: 'tr5', title: 'Amplifier', artist: 'Imran Khan', mood: 'Cruising Groove' },
    ]
  },
  {
    id: 'auto',
    name: 'Bajaj RE Auto-Rickshaw Stand',
    hindiName: 'ऑटो रिक्शा स्टैंड "मीटर डाउन"',
    tagline: 'Meter Down & Mumbai Street Groove',
    category: 'City Transport',
    description: 'Iconic yellow-and-green three-wheeler with retro Rexine seats, decorative tasselled curtains, "Shree Ganesh" dashboard, and booming sound system.',
    culturalDetail: 'The true urban glider of Indian streets — navigating through tight gullies with agile swerves and customized subwoofers.',
    playlistId: 'PLKY03nOAYUfU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLKY03nOAYUfU',
    videoIds: [
      'H8b2hV2x_u4', // Mere Gully Mein - DIVINE
      'jFGKJBPmVv4', // Apna Time Aayega - Gully Boy
      'x4Z3_Qx2w3c', // Bombay Dreams - KSHMR
      '69CEiHfS_mc', // Lungi Dance - Yo Yo Honey Singh
      '_3Qv8d8T6l0', // Awaara Hoon Lo-fi
    ],
    icon: 'Navigation',
    accentColor: '#10B981',
    glowColor: 'rgba(168, 185, 129, 0.4)',
    position: { x: 8, y: 0, z: -14 },
    radius: 7.5,
    hasInterior: true,
    interiorSpawn: { x: 7.38, y: 1.25, z: -13.80, yaw: Math.PI * 0.6, seatHeight: 0.27 },
    actionPrompt: 'Hop into the back seat for an auto ride through town',
    ambientProfile: { type: 'auto', intensity: 0.7 },
    sampleTracks: [
      { id: 'a1', title: 'Mere Gully Mein', artist: 'DIVINE & Naezy', mood: 'Raw Hip-Hop' },
      { id: 'a2', title: 'Apna Time Aayega', artist: 'Ranveer Singh & DIVINE', mood: 'Street Anthem' },
      { id: 'a3', title: 'Bombay Dreams', artist: 'KSHMR & Lost Stories', mood: 'Street Electro' },
      { id: 'a4', title: 'Lungi Dance (Bass Boosted)', artist: 'Yo Yo Honey Singh', mood: 'Rickshaw Bass' },
      { id: 'a5', title: 'Awaara Hoon (Lo-fi Flip)', artist: 'Mukesh & Lo-fi Beats', mood: 'Nostalgic Commute' },
    ]
  },
  {
    id: 'bus',
    name: 'State Transport "Lal Dabba" Bus',
    hindiName: 'राज्य परिवहन "लाल डब्बा" एक्सप्रेस',
    tagline: 'Window Seat Nostalgia & Journey Melodies',
    category: 'Public Transport',
    description: 'A classic red state transit bus with open sliding windows, overhead luggage racks with rope nets, silver ticket punchers, and green vinyl double seats.',
    culturalDetail: 'Connecting thousands of remote villages to bustling cities; the window seat with cool evening breeze and earphones on is an emotion.',
    playlistId: 'PLSElsiI-MfzU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLSElsiI-MfzU',
    videoIds: [
      'o0dE7r_9k6g', // Musafir Hoon Yaaron - Kishore Kumar
      'fdubeMFwuGs', // Ilahi - Yeh Jawaani Hai Deewani
      '8yW6qZ1H8zQ', // Yun Hi Chala Chal - Swades
      '_38ZX_r_14o', // Safarnama - Lucky Ali
      'g2cQ8l2V0eM', // Tanha Dil - Shaan
    ],
    icon: 'Bus',
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    position: { x: -18, y: 0, z: 36 },
    radius: 11,
    hasInterior: true,
    interiorSpawn: { x: -18.8, y: 2.30, z: 34.9, yaw: -Math.PI * 0.5, seatHeight: 1.13 },
    actionPrompt: 'Step aboard the bus and take the beloved window seat',
    ambientProfile: { type: 'highway', intensity: 0.7 },
    sampleTracks: [
      { id: 'bu1', title: 'Musafir Hoon Yaaron', artist: 'Kishore Kumar & R.D. Burman', mood: 'Classic Journey' },
      { id: 'bu2', title: 'Ilahi (Long Route)', artist: 'Arijit Singh & Pritam', mood: 'Wanderlust' },
      { id: 'bu3', title: 'Yun Hi Chala Chal Rahi', artist: 'Udit Narayan & Hariharan', mood: 'Highway Roadtrip' },
      { id: 'bu4', title: 'Safarnama', artist: 'Lucky Ali & A.R. Rahman', mood: 'Soul Exploration' },
      { id: 'bu5', title: 'Tanha Dil', artist: 'Shaan', mood: 'Late Night Travel' },
    ]
  },
  {
    id: 'office',
    name: 'IndiTech Software Workspace',
    hindiName: 'इंडिटेक कॉर्पोरेट टॉवर',
    tagline: 'Lo-Fi Chill, Focus & Coding Sessions',
    category: 'Corporate Hub',
    description: 'A sleek modern tech workspace with dual 4K monitors, warm ambient bias lighting, ergonomic mesh chairs, ceramic coffee mugs, and Kanban boards.',
    culturalDetail: 'Where modern India crafts code late into the dusk, powered by Filter Coffee, Chai breaks, and smooth Lo-Fi beats.',
    playlistId: 'PLET9EkEOZmpY',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLET9EkEOZmpY',
    videoIds: [
      '5qap5aO4i9A', // Lofi Girl Indian Classical Chill
      'jfKfPfyJRdk', // Sitar & Monsoon Desi Lo-Fi
      'DWcJFNfaw9c', // Midnight Chai & Raga Chillhop
      'hBC82p3fQk0', // Cyber City Bangalore Coding Beats
    ],
    icon: 'Building2',
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    position: { x: 34, y: 0, z: -26 },
    radius: 13,
    hasInterior: true,
    interiorSpawn: { x: 34.0, y: 1.44, z: -25.2, yaw: Math.PI, seatHeight: 0.17 },
    actionPrompt: 'Sit at the workstation for a high-focus chill session',
    ambientProfile: { type: 'office', intensity: 0.5 },
    sampleTracks: [
      { id: 'o1', title: 'Bangalore Lo-Fi Rain', artist: 'Desi Chill Beats', mood: 'Code & Chill' },
      { id: 'o2', title: 'Midnight Chai & Sitar Chillhop', artist: 'Chaiwala Beats', mood: 'Deep Focus' },
      { id: 'o3', title: 'Cyber City Nights', artist: 'Indie Wave India', mood: 'Ambient Workspace' },
      { id: 'o4', title: 'Monsoon Filter Coffee', artist: 'Carnatic Lo-Fi', mood: 'Smooth Jazz-Lofi' },
    ]
  },
  {
    id: 'baraat',
    name: 'DJ Rocky Baraat & Wedding Celebration',
    hindiName: 'डीजे रॉकी बारात व शादी का जश्न',
    tagline: 'High-Decibel Dhol, Bass & Bhangra Frenzy',
    category: 'Street Celebration',
    description: 'A grand street wedding procession with dazzling LED light towers, marigold flower gates, a booming mobile DJ generator truck, and ecstatic dancing.',
    culturalDetail: 'The quintessential Indian celebration — relatives, friends, and passers-by uniting under confetti and heart-thumping dhol rhythms.',
    playlistId: 'PLGfuERQvUJwI',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLGfuERQvUJwI',
    videoIds: [
      'h03W0R9wLzM', // Sauda Khara Khara - Diljit Dosanjh & Sukhbir
      'k4yXQkG2s1E', // London Thumakda - Labh Janjua
      '_KhQT-LGb-4', // Aankh Marey - Mika Singh
      'jCEdTq3j-0U', // Gallan Goodiyaan - Dil Dhadakne Do
      '4F_lY3r29kM', // Zingaat - Dhadak
    ],
    icon: 'Sparkles',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    position: { x: -34, y: 0, z: 6 },
    radius: 14,
    hasInterior: false,
    interiorSpawn: { x: -34, y: 1.6, z: 6, yaw: -Math.PI * 0.2, seatHeight: 0.0 },
    actionPrompt: 'Jump right into the circle of dancing baraatis',
    ambientProfile: { type: 'baraat', intensity: 0.9 },
    sampleTracks: [
      { id: 'd1', title: 'Sauda Khara Khara', artist: 'Diljit Dosanjh & Sukhbir', mood: 'Bhangra Blast' },
      { id: 'd2', title: 'London Thumakda', artist: 'Labh Janjua & Sonu Kakkar', mood: 'Wedding Classic' },
      { id: 'd3', title: 'Aankh Marey (Baraat Remix)', artist: 'Mika Singh & Neha Kakkar', mood: 'Dance Mania' },
      { id: 'd4', title: 'Gallan Goodiyaan', artist: 'Yashita Sharma & Farhan Akhtar', mood: 'Family Groove' },
      { id: 'd5', title: 'Zingaat (Dhol Mix)', artist: 'Ajay-Atul', mood: 'Peak Energy' },
    ]
  },
  {
    id: 'concert',
    name: 'Coke Studio Live Stage',
    hindiName: 'कोक स्टूडियो लाइव कॉन्सर्ट स्टेज',
    tagline: 'Fusion Rock, Stage Lights & Electric Crowds',
    category: 'Live Music Arena',
    description: 'A massive open-air amphitheater with moving stage spotlights, heavy concert subwoofers, smoke machines, and an energized crowd swaying to fusion rock.',
    culturalDetail: 'Celebrating the modern renaissance of Indian music — fusion of classical ragas with electric guitars, synths, and stadium drums.',
    playlistId: 'PLOkgHQuvDYAU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLOkgHQuvDYAU',
    videoIds: [
      'c7_m6b_e2Qc', // Tajdar-e-Haram - Atif Aslam
      'kw4tT7SCmaY', // Afreen Afreen - Rahat & Momina
      '7D4vNcK6D38', // Tu Jhoom - Abida Parveen & Naseebo Lal
      '5Eqb_-j3FDA', // Pasoori - Ali Sethi & Shae Gill
      '1gukvh448AU', // Madari - Clinton Cerejo & Vishal Dadlani
    ],
    icon: 'Radio',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    position: { x: 40, y: 0, z: 30 },
    radius: 16,
    hasInterior: false,
    interiorSpawn: { x: 36, y: 1.8, z: 26, yaw: Math.PI * 0.25, seatHeight: 0.0 },
    actionPrompt: 'Step up to the VIP concert arena front row',
    ambientProfile: { type: 'concert', intensity: 0.85 },
    sampleTracks: [
      { id: 'c1', title: 'Tajdar-e-Haram (Live)', artist: 'Atif Aslam', mood: 'Stadium Sufi' },
      { id: 'c2', title: 'Afreen Afreen (Fusion Live)', artist: 'Rahat Fateh Ali Khan & Momina', mood: 'Ethereal Magic' },
      { id: 'c3', title: 'Tu Jhoom', artist: 'Abida Parveen & Naseebo Lal', mood: 'Pure Ecstasy' },
      { id: 'c4', title: 'Pasoori (Live Stage)', artist: 'Ali Sethi & Shae Gill', mood: 'Stadium Sensation' },
      { id: 'c5', title: 'Madari', artist: 'Vishal Dadlani & Clinton Cerejo', mood: 'Folk Fusion' },
    ]
  },
  {
    id: 'mahfil',
    name: 'Nizamuddin Haveli Mahfil-e-Qawwali',
    hindiName: 'निज़ामुद्दीन हवेली महफ़िल-ए-क़व्वाली',
    tagline: 'Intimate Sufi Baithak & Mystical Rhythms',
    category: 'Heritage Courtyard',
    description: 'A moonlit Mughal courtyard with Persian silk carpets, velvet bolster pillows (gaddi), carved jali arches, glowing brass lanterns, and clapped rhythm.',
    culturalDetail: 'The timeless tradition of spiritual transcendence — where poetry, harmonium, tabla, and synchronized clapping connect souls directly to the divine.',
    playlistId: 'PLOkgHQuvDYAU',
    playlistUrl: 'https://music.youtube.com/playlist?list=PLOkgHQuvDYAU',
    videoIds: [
      'k1-TrAvp_xs', // Dam Mast Qalandar - Nusrat Fateh Ali Khan
      '8pW_Q7w-JvE', // Yeh Jo Halka Halka Suroor - NFAK
      '60h4dC8f7_c', // Chhap Tilak Sab Chhini - Sabri Brothers
      'vA7t_b7g8Ww', // Bhar Do Jholi Meri - Amjad Sabri
      'g5V_ma8gZ50', // Man Kunto Maula - Fareed Ayaz
    ],
    icon: 'Music',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    position: { x: 16, y: 0, z: -40 },
    radius: 12,
    hasInterior: true,
    interiorSpawn: { x: 16.0, y: 1.47, z: -38.2, yaw: 0, seatHeight: 0.65 },
    actionPrompt: 'Take a seat on the velvet gaddi for the live Qawwali baithak',
    ambientProfile: { type: 'mahfil', intensity: 0.8 },
    sampleTracks: [
      { id: 'm1', title: 'Dam Mast Qalandar', artist: 'Nusrat Fateh Ali Khan', mood: 'Mystical Trance' },
      { id: 'm2', title: 'Yeh Jo Halka Halka Suroor', artist: 'Nusrat Fateh Ali Khan', mood: 'Soulful Baithak' },
      { id: 'm3', title: 'Chhap Tilak Sab Chhini', artist: 'Sabri Brothers', mood: 'Devotional Bliss' },
      { id: 'm4', title: 'Bhar Do Jholi Meri', artist: 'Amjad Sabri', mood: 'Spiritual Longing' },
      { id: 'm5', title: 'Man Kunto Maula', artist: 'Fareed Ayaz & Abu Muhammad', mood: 'Classical Qawwali' },
    ]
  }
];

export const CITY_DEFAULT_TRACKS: TrackInfo[] = [
  { id: 'city1', title: 'DhunMarg Evening Atmosphere', artist: 'Streets of India Radio', mood: 'Dusk Wander' },
  { id: 'city2', title: 'Sitar & Street Breeze', artist: 'Urban Raga Ensemble', mood: 'Twilight Stroll' },
];
