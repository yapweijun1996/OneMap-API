const ONE_MAP_REV_GEO_URL = 'https://www.onemap.gov.sg/api/public/revgeocode';

function normalizeNil(value) {
  if (value == null) return '';
  const text = String(value).trim();
  return text === 'NIL' ? '' : text;
}

function toNumber(value) {
  const num = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(num) ? num : null;
}

export function buildRevGeocodeUrl({ lat, lng, buffer = 50, addressType = 'All' }) {
  const latNum = toNumber(lat);
  const lngNum = toNumber(lng);
  if (latNum == null || lngNum == null) throw new Error('Invalid lat/lng');

  const params = new URLSearchParams({
    location: `${latNum},${lngNum}`,
    buffer: String(buffer),
    addressType: String(addressType),
  });
  return `${ONE_MAP_REV_GEO_URL}?${params.toString()}`;
}

export function formatFullAddress(best) {
  if (!best) return '';
  const block = normalizeNil(best.BLOCK);
  const road = normalizeNil(best.ROAD);
  const postal = normalizeNil(best.POSTALCODE);
  const building = normalizeNil(best.BUILDINGNAME);

  const line1 = [block, road].filter(Boolean).join(' ');
  const line2 = [building, postal ? `S(${postal})` : ''].filter(Boolean).join(' ');
  return [line1, line2].filter(Boolean).join('\n');
}

export async function reverseGeocode({
  lat,
  lng,
  buffer = 50,
  addressType = 'All',
  token,
  fetchImpl = fetch,
} = {}) {
  const url = buildRevGeocodeUrl({ lat, lng, buffer, addressType });

  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetchImpl(url, headers.size ? { headers } : undefined);
  if (!res.ok) throw new Error(`OneMap revgeocode failed (${res.status})`);

  const raw = await res.json();
  const geocodeInfo = Array.isArray(raw?.GeocodeInfo) ? raw.GeocodeInfo : [];
  const best = geocodeInfo[0] || null;

  return {
    url,
    raw,
    geocodeInfo,
    best,
    fullAddress: formatFullAddress(best),
  };
}

