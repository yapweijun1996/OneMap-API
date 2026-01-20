export function initEngineerUi() {
  const $ = (id) => document.getElementById(id);

  const el = {
    combined: $('combined'),
    email: $('email'),
    lat: $('lat'),
    lng: $('lng'),
    buffer: $('buffer'),
    addressType: $('addressType'),
    password: $('password'),
    token: $('token'),
    btnLogin: $('btnLogin'),
    btnLookup: $('btnLookup'),
    btnClear: $('btnClear'),
    btnCopyCurl: $('btnCopyCurl'),
    btnCopyJson: $('btnCopyJson'),
    btnCopyHelper: $('btnCopyHelper'),
    btnCopyUsage: $('btnCopyUsage'),
    btnCopyMermaid: $('btnCopyMermaid'),
    status: $('status'),
    tokenStatus: $('tokenStatus'),
    results: $('results'),
    raw: $('raw'),
    toast: $('toast'),
    helper: $('helper'),
    mermaid: $('mermaid'),
  };

  let isSyncing = false;

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]),
    );
  }

  function setToast(msg) {
    el.toast.textContent = msg ? `提示：${msg}` : '';
  }

  function setBusy(isBusy) {
    el.btnLogin.disabled = isBusy;
    el.btnLookup.disabled = isBusy;
    el.btnClear.disabled = isBusy;
    el.btnCopyCurl.disabled = isBusy;
  }

  function setStatus(text, tone) {
    const cls = tone === 'ok' ? 'ok' : tone === 'bad' ? 'bad' : '';
    el.status.innerHTML = `<b>Status</b><span class="${cls}">${escapeHtml(text)}</span>`;
  }

  function renderTokenStatus(tokenExpiry) {
    const token = el.token.value.trim();
    if (!token) {
      el.tokenStatus.innerHTML = `<b>Token</b><span>未取得</span>`;
      return;
    }
    const suffix = tokenExpiry ? `有效（到期：${tokenExpiry}）` : '已设置';
    el.tokenStatus.innerHTML = `<b class="ok">Token</b><span>${escapeHtml(suffix)}</span>`;
  }

  function renderEmpty() {
    el.results.innerHTML =
      `<div class="resultItem"><div class="addr">输入坐标后点击 Reverse Geocode</div>` +
      `<div class="meta">会显示 GeocodeInfo 候选列表，以及 best（第一笔）</div></div>`;
  }

  function renderResults({ url, list }) {
    if (!list.length) {
      el.results.innerHTML =
        `<div class="resultItem"><div class="addr">0 结果</div><div class="meta">建议调整 buffer 或检查 lat/lng（WGS84）</div></div>` +
        `<div class="resultItem"><div class="addr">请求 URL</div><div class="meta">${escapeHtml(url)}</div></div>`;
      return;
    }

    const best = list[0];
    const onemapLink =
      best.latitude && best.longitude
        ? `https://www.onemap.gov.sg/main/v2/?lat=${encodeURIComponent(best.latitude)}&lng=${encodeURIComponent(best.longitude)}`
        : '';
    const bestMeta = [
      `fullAddress=${best.fullAddress}`,
      best.buildingName && `BUILDING=${best.buildingName}`,
      best.block && `BLK=${best.block}`,
      best.road && `ROAD=${best.road}`,
      best.postalCode && `POSTAL=${best.postalCode}`,
      best.x && `X=${best.x}`,
      best.y && `Y=${best.y}`,
      best.latitude && `Lat=${best.latitude}`,
      best.longitude && `Lng=${best.longitude}`,
      onemapLink && `OneMap=${onemapLink}`,
    ]
      .filter(Boolean)
      .join('\n');

    const listHtml = list
      .map((a, idx) => {
        const parts = [
          a.buildingName && `BUILDING=${a.buildingName}`,
          a.block && `BLK=${a.block}`,
          a.road && `ROAD=${a.road}`,
          a.postalCode && `POSTAL=${a.postalCode}`,
          a.x && `X=${a.x}`,
          a.y && `Y=${a.y}`,
          a.latitude && `Lat=${a.latitude}`,
          a.longitude && `Lng=${a.longitude}`,
        ]
          .filter(Boolean)
          .join(' · ');
        const title = `${idx + 1}. ${a.fullAddress || '(Address N/A)'}`;
        return `<div class="resultItem"><div class="addr">${escapeHtml(title)}</div><div class="meta">${escapeHtml(parts)}</div></div>`;
      })
      .join('');

    el.results.innerHTML =
      `<div class="resultItem"><div class="addr">best（默认取第 1 笔）</div><div class="meta">${escapeHtml(bestMeta)}</div></div>` +
      `<div class="resultItem"><div class="addr">请求 URL</div><div class="meta">${escapeHtml(url)}</div></div>` +
      listHtml;
  }

  function syncFromSeparate() {
    if (isSyncing) return;
    isSyncing = true;
    const lat = el.lat.value.trim();
    const lng = el.lng.value.trim();
    el.combined.value = lat && lng ? `${lat}, ${lng}` : '';
    isSyncing = false;
  }

  function syncFromCombined() {
    if (isSyncing) return;
    isSyncing = true;
    const val = el.combined.value.trim();
    if (!val) {
      el.lat.value = '';
      el.lng.value = '';
    } else {
      const parts = val.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        el.lat.value = parts[0];
        el.lng.value = parts[1];
      }
    }
    isSyncing = false;
  }

  function getInput() {
    let latStr = el.lat.value.trim();
    let lngStr = el.lng.value.trim();
    if (!latStr || !lngStr) {
      const val = el.combined.value.trim();
      if (val) {
        const parts = val.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          latStr = parts[0];
          lngStr = parts[1];
          el.lat.value = latStr;
          el.lng.value = lngStr;
        }
      }
    }

    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('请填写有效的 lat/lng（数字）');
    return {
      email: el.email.value.trim(),
      password: el.password.value,
      lat,
      lng,
      buffer: Number(el.buffer.value) || 50,
      addressType: el.addressType.value || 'All',
      token: el.token.value.trim(),
    };
  }

  function bindSyncHandlers() {
    el.lat.addEventListener('input', syncFromSeparate);
    el.lng.addEventListener('input', syncFromSeparate);
    el.combined.addEventListener('input', syncFromCombined);
  }

  function setDefaults() {
    el.lat.value = '1.3521';
    el.lng.value = '103.8198';
    syncFromSeparate();
  }

  return {
    el,
    bindSyncHandlers,
    getInput,
    renderEmpty,
    renderResults,
    renderTokenStatus,
    setBusy,
    setDefaults,
    setStatus,
    setToast,
  };
}

