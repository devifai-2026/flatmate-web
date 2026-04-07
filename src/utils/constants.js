// ── Verified working Unsplash image URLs ──

export const HERO_BG = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80';
export const AUTH_BG = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80';

// Each city — unique landmark photos (all verified)
export const CITY_IMAGES = {
  // India
  mumbai:    { country: 'India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', label: 'Mumbai' },
  delhi:     { country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', label: 'Delhi' },
  bangalore: { country: 'India', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', label: 'Bangalore' },
  hyderabad: { country: 'India', image: 'https://i.ibb.co/n8nrPF84/photo-1661170300070-73ff77592f68-q-80-w-1631-auto-format-fit-crop-ixlib-rb-4-1.jpg', label: 'Hyderabad' },
  pune:      { country: 'India', image: 'https://i.ibb.co/S73ZsyjW/photo-1618805714320-f8825019c1be-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Pune' },
  kolkata:   { country: 'India', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80', label: 'Kolkata' },
  chennai:   { country: 'India', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', label: 'Chennai' },
  jaipur:    { country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', label: 'Jaipur' },
  gurgaon:   { country: 'India', image: 'https://i.ibb.co/QFY562nJ/photo-1689338039987-8a2539194e27-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Gurgaon' },
  noida:     { country: 'India', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', label: 'Noida' },

  // United Kingdom
  london:    { country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', label: 'London' },
  leicester: { country: 'United Kingdom', image: 'https://i.ibb.co/G3HXhW9f/premium-photo-1716236667158-9143521d423d-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Leicester' },
  liverpool: { country: 'United Kingdom', image: 'https://i.ibb.co/b5P3WY6W/photo-1726410238762-2388af04eadb-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Liverpool' },
  sheffield: { country: 'United Kingdom', image: 'https://i.ibb.co/Kcc2SCzS/photo-1604154315861-e1803bfcaf30-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Sheffield' },
  newcastle: { country: 'United Kingdom', image: 'https://i.ibb.co/dsd9SgXd/premium-photo-1721160364749-018176213207-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Newcastle' },
  cardiff:   { country: 'United Kingdom', image: 'https://i.ibb.co/twmC0g6f/premium-photo-1742457733585-9f82e246d74f-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Cardiff' },
  edinburgh: { country: 'United Kingdom', image: 'https://i.ibb.co/V5RS9fC/premium-photo-1714573189973-018546b10078-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Edinburgh' },
  plymouth:  { country: 'United Kingdom', image: 'https://i.ibb.co/tw9d8t3F/premium-photo-1674512539957-bd223b391186-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Plymouth' },
  birmingham: { country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1568283096533-078a24930eb8?w=600&q=80', label: 'Birmingham' },
  nottingham: { country: 'United Kingdom', image: 'https://i.ibb.co/xKTDcg5M/photo-1559208944-221ef1b9d9e3-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Nottingham' },
  coventry:   { country: 'United Kingdom', image: 'https://i.ibb.co/1tr4Dmvv/photo-1603823254085-cb0592ecf970-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Coventry' },
  leeds:      { country: 'United Kingdom', image: 'https://i.ibb.co/B5ppPCtC/premium-photo-1699566447795-586a5b2367f6-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Leeds' },
  manchester: { country: 'United Kingdom', image: 'https://i.ibb.co/pvbqdQkC/photo-1623960146923-e77aee115f74-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Manchester' },
  swansea:    { country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=600&q=80', label: 'Swansea' },
  salford:    { country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1533282960533-51328aa49826?w=600&q=80', label: 'Salford' },
  aberdeen:   { country: 'United Kingdom', image: 'https://i.ibb.co/84zmqRVW/premium-photo-1669927131902-a64115445f0f-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg', label: 'Aberdeen' },

  // Australia
  sydney:    { country: 'Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80', label: 'Sydney' },
  melbourne: { country: 'Australia', image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400&q=80', label: 'Melbourne' },

  // United States
  nyc:       { country: 'United States', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80', label: 'New York' },
  la:        { country: 'United States', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80', label: 'Los Angeles' },
};

export const GLOBAL_COUNTRIES = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Singapore', flag: '🇸🇬' },
];

export const USER_TYPES = [
  { id: 'looking', label: 'Looking for a room', icon: '🔍' },
  { id: 'have', label: 'Looking for a flatmate', icon: '🏠' },
];

export const LIFESTYLE_TAGS = [
  { id: 'night-owl', label: 'Night Owl', emoji: '🦉' },
  { id: 'early-bird', label: 'Early Bird', emoji: '☀️' },
  { id: 'fitness-freak', label: 'Fitness Freak', emoji: '💪' },
  { id: 'foodie', label: 'Foodie', emoji: '🍳' },
  { id: 'gamer', label: 'Gamer', emoji: '🎮' },
  { id: 'clean-freak', label: 'Clean Freak', emoji: '✨' },
  { id: 'pet-lover', label: 'Pet Lover', emoji: '🐾' },
  { id: 'music-lover', label: 'Music Lover', emoji: '🎵' },
  { id: 'traveler', label: 'Traveler', emoji: '✈️' },
  { id: 'studious', label: 'Studious', emoji: '📚' },
  { id: 'party-lover', label: 'Party Lover', emoji: '🥳' },
  { id: 'wanderer', label: 'Wanderer', emoji: '🎒' },
  { id: 'vegan', label: 'Vegan', emoji: '🌿' },
  { id: 'non-smoker', label: 'Non-Smoker', emoji: '🚭' },
  { id: 'non-alcoholic', label: 'Non-Alcoholic', emoji: '🚫' },
  { id: 'workaholic', label: 'Workaholic', emoji: '💼' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🧘' },
];

// Fallback gradient for broken images
export const CITY_GRADIENTS = {
  mumbai: 'from-blue-600 to-cyan-500',
  delhi: 'from-orange-600 to-red-500',
  bangalore: 'from-green-600 to-emerald-500',
};

export const PLATFORM_STATS = [
  { label: 'Active Users', value: 10000, icon: '🏠' },
  { label: 'Rooms Listed', value: 5000, icon: '✨' },
  { label: 'Matches Made', value: 25000, icon: '🌏' },
  { label: 'Cities Covered', value: 50, icon: '🏢' },
];

export const ROOM_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
];

export const AVATAR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80',
];

export const DEFAULT_AVATARS = AVATAR_PLACEHOLDERS;

export function getRoomImage(id, images) {
  if (images?.length > 0) return images[0];
  const index = id ? id.charCodeAt(id.length - 1) % ROOM_PLACEHOLDERS.length : 0;
  return ROOM_PLACEHOLDERS[index];
}

export function getAvatar(userId, profileImage) {
  if (profileImage) return profileImage;
  const index = userId ? userId.charCodeAt(userId.length - 1) % AVATAR_PLACEHOLDERS.length : 0;
  return AVATAR_PLACEHOLDERS[index];
}
