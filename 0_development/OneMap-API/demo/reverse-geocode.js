import { getOneMapToken, reverseGeocode, normalizeRevGeoResponse } from './onemap-client.js';

const elEmail = document.getElementById('email');
const elPassword = document.getElementById('password');
const elLat = document.getElementById('lat');
const elLng = document.getElementById('lng');
const elCombined = document.getElementById('combined');
const elBuffer = document.getElementById('buffer');
const elAddressType = document.getElementById('addressType');
const elBtnLogin = document.getElementById('btnLogin');
const elBtnLookup = document.getElementById('btnLookup');
const elBtnClear = document.getElementById('btnClear');
const elTokenStatus = document.getElementById('tokenStatus');
const elResults = document.getElementById('results');
const elRaw = document.getElementById('raw');

let token = '';
let tokenExpiry = '';

/**** AMENDMENT [start] "Move isSyncing to top to fix TDZ error" ****/
let isSyncing = false;
/**** AMENDMENT [end  ] "Move isSyncing to top to fix TDZ error" ****/

setExampleCoordinates();
render();

elBtnLogin.addEventListener('click', async () => {
  try {
    setBusy(true);
    const email = elEmail.value.trim();
    const password = elPassword.value;
    const res = await getOneMapToken({ email, password });
    token = res?.access_token ?? '';
    tokenExpiry = res?.expiry_timestamp ?? '';
    render();
  } catch (err) {
    token = '';
    tokenExpiry = '';
    renderError(err);
  } finally {
    setBusy(false);
  }
});

	elBtnLookup.addEventListener('click', async () => {
	  try {
	    setBusy(true);
	
	    /**** AMENDMENT [start] "Add coordinate validation with combined fallback" ****/
	    let latStr = elLat.value.trim();
	    let lngStr = elLng.value.trim();

    // If lat/lng are empty, try to extract from combined input
    if (!latStr || !lngStr) {
      const combinedVal = elCombined.value.trim();
      if (combinedVal) {
        const parts = combinedVal.split(/[,\s]+/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          latStr = parts[0];
          lngStr = parts[1];
          // Sync back to separate inputs
          elLat.value = latStr;
          elLng.value = lngStr;
        }
      }
    }

    if (!latStr || !lngStr) {
      throw new Error('請輸入完整的經緯度座標（可使用 Combined 或分開輸入）');
    }

    const lat = Number(latStr);
    const lng = Number(lngStr);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error('經緯度必須是有效的數字');
    }
    /**** AMENDMENT [end  ] "Add coordinate validation with combined fallback" ****/

    const buffer = Number(elBuffer.value);
    const addressType = elAddressType.value;

    const json = await reverseGeocode({ lat, lng, token, buffer, addressType });
    const list = normalizeRevGeoResponse(json);

    renderResults(list);
    elRaw.innerHTML = syntaxHighlight(json);
    elRaw.style.display = 'block';
  } catch (err) {
    renderError(err);
  } finally {
    setBusy(false);
  }
});

elBtnClear.addEventListener('click', () => {
  token = '';
  tokenExpiry = '';
  elEmail.value = '';
  elPassword.value = '';
  setExampleCoordinates();
  elResults.innerHTML = '';
  elRaw.innerHTML = '';
  elRaw.style.display = 'none';
	  render();
	});
	
/**** AMENDMENT [start] "Coords Sync Logic - Fixed infinite loop" ****/
function syncFromSeparate() {
  if (isSyncing) return;
  isSyncing = true;

  const lat = elLat.value.trim();
  const lng = elLng.value.trim();
  if (lat && lng) {
    elCombined.value = `${lat}, ${lng}`;
  } else {
    elCombined.value = '';
  }

  isSyncing = false;
}

function syncFromCombined() {
  if (isSyncing) return;
  isSyncing = true;

  const val = elCombined.value.trim();
  if (!val) {
    elLat.value = '';
    elLng.value = '';
  } else {
    // Split by comma or one+ spaces
    const parts = val.split(/[,\s]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      elLat.value = parts[0];
      elLng.value = parts[1];
    }
  }

  isSyncing = false;
}

elLat.addEventListener('input', syncFromSeparate);
elLng.addEventListener('input', syncFromSeparate);
elCombined.addEventListener('input', syncFromCombined);
/**** AMENDMENT [end  ] "Coords Sync Logic - Fixed infinite loop" ****/

function setBusy(isBusy) {
  elBtnLogin.disabled = isBusy;
  elBtnLookup.disabled = isBusy || !token;
  elBtnClear.disabled = isBusy;
}

function render() {
  elBtnLookup.disabled = !token;
  if (token) {
    elTokenStatus.classList.remove('bad');
    elTokenStatus.classList.add('ok');
    elTokenStatus.innerHTML = `<span>Token Status</span><b style="color: var(--ok)">Active (Expires: ${escapeHtml(tokenExpiry ? new Date(tokenExpiry).toLocaleTimeString() : 'Unknown')})</b>`;
  } else {
    elTokenStatus.classList.remove('ok');
    elTokenStatus.classList.add('bad');
    elTokenStatus.innerHTML = `<span>Token Status</span><b style="color: var(--bad)">Not Retrieved</b>`;
  }
}

function renderResults(list) {
  if (!list.length) {
    elResults.innerHTML = `<div class="result-item"><div class="result-addr">No Results</div><div class="result-meta">Try adjusting coordinates or buffer</div></div>`;
    return;
  }

  elResults.innerHTML = list
    .map((a, idx) => {
      const parts = [
        a.buildingName && `Building=${a.buildingName}`,
        a.block && `Blk=${a.block}`,
        a.road && `Road=${a.road}`,
        a.postalCode && `Postal=${a.postalCode}`,
        a.x && `X=${a.x}`,
        a.y && `Y=${a.y}`,
        a.latitude && `Lat=${a.latitude}`,
        a.longitude && `Lng=${a.longitude}`,
      ]
        .filter(Boolean)
        .join(' · ');

      return `
        <div class="result-item">
          <div class="result-addr">${escapeHtml(`${idx + 1}. ${a.fullAddress || '(Address N/A)'}`)}</div>
          <div class="result-meta">${escapeHtml(parts)}</div>
        </div>
      `;
    })
    .join('');
}

function renderError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  elResults.innerHTML = `<div class="result-item"><div class="result-addr" style="color: var(--bad)">Error Occurred</div><div class="result-meta">${escapeHtml(
    msg,
  )}</div></div>`;
  elRaw.textContent = '';
  render();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}

function setExampleCoordinates() {
  elLat.value = '1.3521';
  elLng.value = '103.8198';
  syncFromSeparate();
}

/**
 * Simple JSON Syntax Highlighter
 */
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
