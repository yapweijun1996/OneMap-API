const BASE_API_URL = 'https://www.onemap.gov.sg/api';

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
  }
  return response.json();
}

export async function getOneMapToken({ email, password }) {
  if (!email || !password) throw new Error('缺少 email 或 password');

  return fetchJson(`${BASE_API_URL}/auth/post/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function reverseGeocode({
  lat,
  lng,
  token,
  buffer = 50,
  addressType = 'All',
}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('lat/lng 必須是數字');

  const url =
    `${BASE_API_URL}/public/revgeocode` +
    `?location=${encodeURIComponent(`${lat},${lng}`)}` +
    `&buffer=${encodeURIComponent(buffer)}` +
    `&addressType=${encodeURIComponent(addressType)}`;

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return fetchJson(url, { headers });
}

export function normalizeRevGeoResponse(revGeoJson) {
  const list = Array.isArray(revGeoJson?.GeocodeInfo) ? revGeoJson.GeocodeInfo : [];
  return list.map((item) => {
    const buildingName = normalizeNIL(item?.BUILDINGNAME);
    const block = normalizeNIL(item?.BLOCK);
    const road = normalizeNIL(item?.ROAD);
    const postalCode = normalizeNIL(item?.POSTALCODE);

    const fullAddress = [buildingName, block, road, postalCode].filter(Boolean).join(' ');

    return {
      fullAddress,
      buildingName,
      block,
      road,
      postalCode,
      x: item?.XCOORD ?? '',
      y: item?.YCOORD ?? '',
      latitude: item?.LATITUDE ?? '',
      longitude: item?.LONGITUDE ?? '',
    };
  });
}

function normalizeNIL(value) {
  const v = String(value ?? '').trim();
  if (!v || v.toUpperCase() === 'NIL') return '';
  return v;
}

