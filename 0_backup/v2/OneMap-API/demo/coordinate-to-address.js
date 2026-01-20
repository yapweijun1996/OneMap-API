import { reverseGeocode } from './onemap-revgeocode.js';

const $ = (id) => document.getElementById(id);
const el = {
  lat: $('lat'),
  lng: $('lng'),
  buffer: $('buffer'),
  addressType: $('addressType'),
  preset: $('preset'),
  btnLookup: $('btnLookup'),
  btnGeo: $('btnGeo'),
  btnSwap: $('btnSwap'),
  btnClear: $('btnClear'),
  error: $('error'),
  fullAddress: $('fullAddress'),
  postal: $('postal'),
  roadBlock: $('roadBlock'),
  building: $('building'),
  onemapLink: $('onemapLink'),
  btnCopyAddress: $('btnCopyAddress'),
  btnCopyJson: $('btnCopyJson'),
  rawJson: $('rawJson'),
};

let lastResult = null;

function showError(message) {
  el.error.hidden = !message;
  el.error.textContent = message || '';
}

function parseLatLng(text) {
  const m = String(text || '').trim().match(/^(-?\\d+(?:\\.\\d+)?),\\s*(-?\\d+(?:\\.\\d+)?)$/);
  if (!m) return null;
  return { lat: Number(m[1]), lng: Number(m[2]) };
}

function setLatLng(lat, lng) {
  el.lat.value = String(lat ?? '');
  el.lng.value = String(lng ?? '');
}

function updateResultUI(res) {
  lastResult = res;
  const best = res?.best;
  const block = best?.BLOCK && best.BLOCK !== 'NIL' ? best.BLOCK : '';
  const road = best?.ROAD && best.ROAD !== 'NIL' ? best.ROAD : '';
  const postal = best?.POSTALCODE && best.POSTALCODE !== 'NIL' ? best.POSTALCODE : '';
  const building = best?.BUILDINGNAME && best.BUILDINGNAME !== 'NIL' ? best.BUILDINGNAME : '';

  el.fullAddress.textContent = res?.fullAddress || '—';
  el.postal.textContent = postal || '—';
  el.roadBlock.textContent = [block, road].filter(Boolean).join(' ') || '—';
  el.building.textContent = building || '—';

  const lat = Number(el.lat.value);
  const lng = Number(el.lng.value);
  const mapUrl = Number.isFinite(lat) && Number.isFinite(lng)
    ? `https://www.onemap.gov.sg/main/v2/?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
    : '';
  el.onemapLink.textContent = mapUrl ? '在 OneMap 開啟' : '—';
  el.onemapLink.href = mapUrl || '#';

  el.rawJson.value = JSON.stringify(res?.raw ?? {}, null, 2);
  el.btnCopyAddress.disabled = !res?.fullAddress;
  el.btnCopyJson.disabled = !res?.raw;
}

async function lookup() {
  showError('');
  el.btnLookup.disabled = true;
  try {
    const lat = Number(el.lat.value);
    const lng = Number(el.lng.value);
    const buffer = Number(el.buffer.value || 50);
    const addressType = el.addressType.value || 'All';
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('請輸入正確的 lat/lng（數字）');

    const res = await reverseGeocode({ lat, lng, buffer, addressType });
    if (!res.best) throw new Error('找不到地址（GeocodeInfo 為空）');
    updateResultUI(res);
  } catch (e) {
    updateResultUI(null);
    showError(e?.message || String(e));
  } finally {
    el.btnLookup.disabled = false;
  }
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

el.preset.addEventListener('change', () => {
  const v = el.preset.value;
  if (!v) return;
  const p = parseLatLng(v);
  if (p) setLatLng(p.lat, p.lng);
});

el.btnLookup.addEventListener('click', lookup);
el.btnSwap.addEventListener('click', () => setLatLng(el.lng.value, el.lat.value));
el.btnClear.addEventListener('click', () => {
  setLatLng('', '');
  el.buffer.value = '50';
  el.addressType.value = 'All';
  el.preset.value = '';
  updateResultUI(null);
  showError('');
});

el.btnGeo.addEventListener('click', () => {
  showError('');
  if (!navigator.geolocation) return showError('此瀏覽器不支援 geolocation');
  navigator.geolocation.getCurrentPosition(
    (pos) => setLatLng(pos.coords.latitude, pos.coords.longitude),
    (err) => showError(`取得定位失敗：${err.message}`)
  );
});

el.btnCopyAddress.addEventListener('click', async () => {
  try {
    await copyText(lastResult?.fullAddress || '');
  } catch (e) {
    showError(`複製失敗：${e?.message || String(e)}`);
  }
});

el.btnCopyJson.addEventListener('click', async () => {
  try {
    await copyText(JSON.stringify(lastResult?.raw ?? {}, null, 2));
  } catch (e) {
    showError(`複製失敗：${e?.message || String(e)}`);
  }
});

setLatLng(1.3521, 103.8198);
updateResultUI(null);

