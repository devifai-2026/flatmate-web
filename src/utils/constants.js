// ── Verified working Unsplash image URLs ──

export const HERO_BG = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80';
export const AUTH_BG = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80';

// Each city — unique landmark photos (all verified)
export const CITY_IMAGES = {
  mumbai:    { image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', label: 'Mumbai', tagline: '12,000+ listings' },
  delhi:     { image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', label: 'Delhi', tagline: '9,500+ listings' },
  bangalore: { image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', label: 'Bangalore', tagline: '11,000+ listings' },
  hyderabad: { image: 'https://images.unsplash.com/photo-1572638319789-1e623724a324?w=600&q=80', label: 'Hyderabad', tagline: '5,200+ listings' },
  pune:      { image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&q=80', label: 'Pune', tagline: '6,800+ listings' },
  kolkata:   { image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80', label: 'Kolkata', tagline: '4,100+ listings' },
  chennai:   { image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', label: 'Chennai', tagline: '5,600+ listings' },
  jaipur:    { image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', label: 'Jaipur', tagline: '2,300+ listings' },
  gurgaon:   { image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80', label: 'Gurgaon', tagline: '7,200+ listings' },
  noida:     { image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', label: 'Noida', tagline: '3,400+ listings' },
};

// Fallback gradient for broken images
export const CITY_GRADIENTS = {
  mumbai: 'from-primary to-primary-light',
  delhi: 'from-primary-dark to-primary',
  bangalore: 'from-primary-light to-primary',
  hyderabad: 'from-primary to-primary-dark',
  pune: 'from-primary-dark to-primary-light',
  kolkata: 'from-primary to-primary-light',
  chennai: 'from-primary-dark to-primary',
  jaipur: 'from-primary-light to-primary-dark',
  gurgaon: 'from-primary to-primary-dark',
  noida: 'from-primary-dark to-primary-light',
};

export const ROOM_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=500&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
];

export const AVATAR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
];

export const ILLUSTRATIONS = {
  search: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  match: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  team: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  secure: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
  moving: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  living: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  happy: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80',
  apartment: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&q=80',
};

export const PLATFORM_STATS = [
  { value: 10000, display: '10,000+', label: 'Active Users', icon: '👥' },
  { value: 5000, display: '5,000+', label: 'Rooms Listed', icon: '🏠' },
  { value: 25000, display: '25,000+', label: 'Matches Made', icon: '✨' },
  { value: 50, display: '50+', label: 'Cities Covered', icon: '🌏' },
];

export const LIFESTYLE_TAGS = [
  { id: 'night-owl', label: 'Night Owl', emoji: '🦉' },
  { id: 'early-bird', label: 'Early Bird', emoji: '🐦' },
  { id: 'studious', label: 'Studious', emoji: '📚' },
  { id: 'fitness-freak', label: 'Fitness Freak', emoji: '🏋️' },
  { id: 'sporty', label: 'Sporty', emoji: '⚽' },
  { id: 'wanderer', label: 'Wanderer', emoji: '🚐' },
  { id: 'party-lover', label: 'Party Lover', emoji: '🎉' },
  { id: 'pet-lover', label: 'Pet Lover', emoji: '🐾' },
  { id: 'vegan', label: 'Vegan', emoji: '🌿' },
  { id: 'non-alcoholic', label: 'Non Alcoholic', emoji: '🚫' },
  { id: 'music-lover', label: 'Music Lover', emoji: '🎸' },
  { id: 'non-smoker', label: 'Non Smoker', emoji: '🚭' },
  { id: 'foodie', label: 'Foodie', emoji: '🍕' },
  { id: 'gamer', label: 'Gamer', emoji: '🎮' },
  { id: 'workaholic', label: 'Workaholic', emoji: '💻' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🧘' },
];

export const USER_TYPES = [
  { id: 'seeker', label: 'You are looking for a Flat/Flatmate/PG', icon: '🔍' },
  { id: 'pg-owner', label: 'You are a PG Owner', icon: '🏢' },
  { id: 'flat-owner', label: 'You are a Flat Owner', icon: '🏠' },
];

export const DEFAULT_AVATARS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Nala&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Abby&backgroundColor=d1f4d1',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Tiger&backgroundColor=ffe0b2',
];

// ── Trusted brand logos (SVG data URIs for "trusted by" section) ──
export const TRUST_LOGOS = [
  { name: 'Featured in YourStory', text: 'YourStory' },
  { name: 'TechCrunch', text: 'TechCrunch' },
  { name: 'Economic Times', text: 'ET' },
  { name: 'Inc42', text: 'Inc42' },
  { name: 'Startup India', text: 'StartupIndia' },
];

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
