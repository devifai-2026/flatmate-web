import api from './api';

const STORAGE_KEY = 'guest_fp';
let lastPath = '';
let pageEnterTime = 0;

// Simple fingerprint based on browser properties (no external library needed)
function generateFingerprint() {
  const nav = navigator;
  const screen = window.screen;
  const raw = [
    nav.userAgent,
    nav.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    nav.hardwareConcurrency || '',
    nav.platform || '',
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return 'gfp_' + Math.abs(hash).toString(36) + '_' + raw.length.toString(36);
}

function getFingerprint() {
  let fp = localStorage.getItem(STORAGE_KEY);
  if (!fp) {
    fp = generateFingerprint();
    localStorage.setItem(STORAGE_KEY, fp);
  }
  return fp;
}

function getDevice() {
  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
  const isTablet = /iPad|Tablet/.test(ua);

  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return {
    type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    os,
    browser,
  };
}

function sendTrack(page) {
  const token = localStorage.getItem('token');
  if (token) return; // logged-in user, skip guest tracking

  const fingerprint = getFingerprint();

  api.post('/guest/track', {
    fingerprint,
    page,
    device: getDevice(),
    referrer: document.referrer || undefined,
  }).catch(() => {}); // silent fail
}

export function trackPageView(path) {
  // Send duration for previous page
  if (lastPath && pageEnterTime) {
    const duration = Math.round((Date.now() - pageEnterTime) / 1000);
    if (duration > 0 && duration < 1800) {
      // We already sent the page visit when entering, duration tracked on next visit
    }
  }

  lastPath = path;
  pageEnterTime = Date.now();

  sendTrack({
    path,
    title: document.title,
    duration: 0,
  });
}
