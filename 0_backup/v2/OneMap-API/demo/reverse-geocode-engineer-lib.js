export function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]),
  );
}

const BASE_API_URL = 'https://www.onemap.gov.sg/api';

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
  }
  return response.json();
}

export function normalizeNil(value) {
  const text = String(value ?? '').trim();
  if (!text || text.toUpperCase() === 'NIL') return '';
  return text;
}

function toNumber(value) {
  const num = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(num) ? num : null;
}

function normalizeBearerToken(token) {
  const raw = String(token ?? '').trim();
  if (!raw) return '';
  return raw.replace(/^bearer\s+/i, '').trim();
}

export async function getOneMapToken({ email, password }) {
  if (!email || !password) throw new Error('缺少 email 或 password');
  return fetchJson(`${BASE_API_URL}/auth/post/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function tryGetJwtExpiryMs(token) {
  const raw = String(token ?? '').trim();
  if (!raw) return null;
  const normalized = raw.replace(/^bearer\s+/i, '').trim();
  const parts = normalized.split('.');
  if (parts.length < 2) return null;

  try {
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadB64 + '='.repeat((4 - (payloadB64.length % 4)) % 4);
    const json = JSON.parse(atob(padded));
    const expSec = Number(json?.exp);
    if (!Number.isFinite(expSec)) return null;
    return expSec * 1000;
  } catch {
    return null;
  }
}

export function buildRevGeocodeUrl({ lat, lng, buffer = 50, addressType = 'All' }) {
  const latNum = toNumber(lat);
  const lngNum = toNumber(lng);
  if (latNum == null || lngNum == null) throw new Error('lat/lng 必须是有效数字');
  const params = new URLSearchParams({
    location: `${latNum},${lngNum}`,
    buffer: String(buffer),
    addressType: String(addressType),
  });
  return `https://www.onemap.gov.sg/api/public/revgeocode?${params.toString()}`;
}

export function formatFullAddress(best) {
  const building = normalizeNil(best?.BUILDINGNAME);
  const block = normalizeNil(best?.BLOCK);
  const road = normalizeNil(best?.ROAD);
  const postal = normalizeNil(best?.POSTALCODE);
  return [building, [block, road].filter(Boolean).join(' '), postal].filter(Boolean).join(' ');
}

export async function reverseGeocode({ lat, lng, buffer = 50, addressType = 'All', token } = {}) {
  const normalizedToken = normalizeBearerToken(token);
  if (!normalizedToken) {
    throw new Error('Unauthorized：此接口目前需要 token。请先按 Get Token 或到 demo/auth-token.html 取得 access_token。');
  }
  const url = buildRevGeocodeUrl({ lat, lng, buffer, addressType });
  const headers = { Authorization: `Bearer ${normalizedToken}` };
  const res = await fetch(url, { headers });
  if (res.status === 401) throw new Error('Unauthorized：token 无效或已过期，请重新取得 token。');
  if (!res.ok) throw new Error(`OneMap revgeocode 失败（${res.status}）`);
  const raw = await res.json();
  const geocodeInfo = Array.isArray(raw?.GeocodeInfo) ? raw.GeocodeInfo : [];
  const best = geocodeInfo[0] || null;
  return { url, raw, geocodeInfo, best, fullAddress: best ? formatFullAddress(best) : '' };
}

export function normalizeForUi(list) {
  return list.map((item) => {
    const buildingName = normalizeNil(item?.BUILDINGNAME);
    const block = normalizeNil(item?.BLOCK);
    const road = normalizeNil(item?.ROAD);
    const postalCode = normalizeNil(item?.POSTALCODE);
    return {
      buildingName,
      block,
      road,
      postalCode,
      x: item?.XCOORD ?? '',
      y: item?.YCOORD ?? '',
      latitude: item?.LATITUDE ?? '',
      longitude: item?.LONGITUDE ?? '',
      fullAddress: [buildingName, block, road, postalCode].filter(Boolean).join(' '),
    };
  });
}

export function getCurl({ url, token }) {
  const normalizedToken = normalizeBearerToken(token);
  return normalizedToken ? `curl -s \"${url}\" -H \"Authorization: Bearer ${normalizedToken}\"` : `curl -s \"${url}\"`;
}

export const ENGINEER_MERMAID_TEXT =
  'flowchart TD\\n' +
  '  U[输入 lat/lng 或 Combined] --> V[解析 + 验证]\\n' +
  '  V --> R[GET /api/public/revgeocode]\\n' +
  '  R --> L[GeocodeInfo[] 候选列表]\\n' +
  '  L --> B[best = GeocodeInfo[0]]\\n' +
  '  B --> A[拼 fullAddress: BUILDING + BLK + ROAD + POSTAL]';

export const ENGINEER_HELPER_TEXT =
  "function normalizeNil(value) {\\n" +
  "  const text = String(value ?? '').trim();\\n" +
  "  if (!text || text.toUpperCase() === 'NIL') return '';\\n" +
  "  return text;\\n" +
  "}\\n\\n" +
  "function toNumber(value) {\\n" +
  "  const num = typeof value === 'number' ? value : Number(String(value).trim());\\n" +
  "  return Number.isFinite(num) ? num : null;\\n" +
  "}\\n\\n" +
  "function buildRevGeocodeUrl({ lat, lng, buffer = 50, addressType = 'All' }) {\\n" +
  "  const latNum = toNumber(lat);\\n" +
  "  const lngNum = toNumber(lng);\\n" +
  "  if (latNum == null || lngNum == null) throw new Error('Invalid lat/lng');\\n" +
  "  const params = new URLSearchParams({ location: `${latNum},${lngNum}`, buffer: String(buffer), addressType: String(addressType) });\\n" +
  "  return `https://www.onemap.gov.sg/api/public/revgeocode?${params.toString()}`;\\n" +
  "}\\n\\n" +
  "function formatFullAddress(best) {\\n" +
  "  const building = normalizeNil(best?.BUILDINGNAME);\\n" +
  "  const block = normalizeNil(best?.BLOCK);\\n" +
  "  const road = normalizeNil(best?.ROAD);\\n" +
  "  const postal = normalizeNil(best?.POSTALCODE);\\n" +
  "  return [building, [block, road].filter(Boolean).join(' '), postal].filter(Boolean).join(' ');\\n" +
  "}\\n\\n" +
  "async function reverseGeocode({ lat, lng, buffer = 50, addressType = 'All', token } = {}) {\\n" +
  "  const url = buildRevGeocodeUrl({ lat, lng, buffer, addressType });\\n" +
  "  const headers = token ? { Authorization: `Bearer ${token.replace(/^bearer\\\\s+/i, '').trim()}` } : undefined;\\n" +
  "  const res = await fetch(url, headers ? { headers } : undefined);\\n" +
  "  if (!res.ok) throw new Error(`OneMap revgeocode failed (${res.status})`);\\n" +
  "  const raw = await res.json();\\n" +
  "  const geocodeInfo = Array.isArray(raw?.GeocodeInfo) ? raw.GeocodeInfo : [];\\n" +
  "  const best = geocodeInfo[0] || null;\\n" +
  "  return { url, raw, geocodeInfo, best, fullAddress: best ? formatFullAddress(best) : '' };\\n" +
  '}';
