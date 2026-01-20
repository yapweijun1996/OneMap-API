import {
  ENGINEER_HELPER_TEXT,
  ENGINEER_MERMAID_TEXT,
  buildRevGeocodeUrl,
  getCurl,
  getOneMapToken,
  normalizeForUi,
  reverseGeocode,
  tryGetJwtExpiryMs,
} from './reverse-geocode-engineer-lib.js';
import { initEngineerUi } from './reverse-geocode-engineer-ui.js';

const ui = initEngineerUi();

let lastJson = null;
let tokenExpiry = '';
let tokenExpiryMs = null;
let didAutoRefresh = false;

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  ui.setToast('已复制到剪贴板');
}

function isTokenStillValid() {
  if (!tokenExpiryMs) return true;
  const skewMs = 60_000;
  return Date.now() < tokenExpiryMs - skewMs;
}

async function ensureToken(email, password) {
  const existing = ui.el.token.value.trim();
  if (existing && isTokenStillValid()) return existing;

  if (existing && !isTokenStillValid()) {
    ui.el.token.value = '';
    tokenExpiry = '';
    tokenExpiryMs = null;
    ui.renderTokenStatus(tokenExpiry);
  }

  if (!email || !password) throw new Error('需要先填写 OneMap Email/Password 才能自动取得 token。');
  const res = await getOneMapToken({ email, password });
  const token = res?.access_token ?? '';
  ui.el.token.value = token;
  tokenExpiryMs = res?.expiry_timestamp ? new Date(res.expiry_timestamp).getTime() : null;
  if (!tokenExpiryMs) tokenExpiryMs = tryGetJwtExpiryMs(token);
  tokenExpiry = tokenExpiryMs ? new Date(tokenExpiryMs).toLocaleString() : '';
  ui.renderTokenStatus(tokenExpiry);
  return token;
}

async function runReverseGeocode() {
  const input = ui.getInput();
  const token = await ensureToken(input.email, input.password);
  const res = await reverseGeocode({ ...input, token });
  lastJson = res.raw;
  ui.el.raw.value = JSON.stringify(res.raw, null, 2);
  ui.el.btnCopyJson.disabled = false;
  ui.renderResults({ url: res.url, list: normalizeForUi(res.geocodeInfo) });
}

ui.bindSyncHandlers();
ui.el.btnCopyJson.disabled = true;
ui.el.mermaid.value = ENGINEER_MERMAID_TEXT;
ui.el.helper.value = ENGINEER_HELPER_TEXT;
ui.renderEmpty();
ui.setDefaults();
ui.renderTokenStatus(tokenExpiry);
ui.setStatus('等待查询…', 'neutral');

ui.el.btnLogin.addEventListener('click', async () => {
  try {
    ui.setToast('');
    ui.setBusy(true);
    ui.setStatus('取得 token 中…', 'neutral');
    const input = ui.getInput();
    await ensureToken(input.email, input.password);
    didAutoRefresh = false;
    ui.setStatus('Token 已取得', 'ok');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    ui.el.token.value = '';
    tokenExpiry = '';
    tokenExpiryMs = null;
    didAutoRefresh = false;
    ui.renderTokenStatus(tokenExpiry);
    ui.setStatus(msg, 'bad');
  } finally {
    ui.setBusy(false);
  }
});

ui.el.btnLookup.addEventListener('click', async () => {
  try {
    ui.setToast('');
    ui.setBusy(true);
    ui.setStatus('查询中…', 'neutral');
    await runReverseGeocode();
    didAutoRefresh = false;
    ui.setStatus('成功', 'ok');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const canRetry = !didAutoRefresh && /unauthorized/i.test(msg) && ui.el.email.value.trim() && ui.el.password.value;

    if (canRetry) {
      try {
        didAutoRefresh = true;
        ui.el.token.value = '';
        tokenExpiry = '';
        tokenExpiryMs = null;
        ui.renderTokenStatus(tokenExpiry);
        await runReverseGeocode();
        ui.setStatus('成功（已自动刷新 token）', 'ok');
        return;
      } catch (retryErr) {
        const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
        ui.setStatus(retryMsg, 'bad');
      }
    } else {
      ui.setStatus(msg, 'bad');
    }

    ui.el.results.innerHTML = `<div class="resultItem"><div class="addr bad">错误</div><div class="meta">${msg}</div></div>`;
    ui.el.raw.value = '';
    lastJson = null;
    ui.el.btnCopyJson.disabled = true;
  } finally {
    ui.setBusy(false);
  }
});

ui.el.btnClear.addEventListener('click', () => {
  ui.el.token.value = '';
  ui.el.email.value = '';
  ui.el.password.value = '';
  ui.el.combined.value = '';
  ui.setDefaults();
  ui.el.raw.value = '';
  lastJson = null;
  ui.el.btnCopyJson.disabled = true;
  tokenExpiry = '';
  tokenExpiryMs = null;
  didAutoRefresh = false;
  ui.renderTokenStatus(tokenExpiry);
  ui.renderEmpty();
  ui.setStatus('等待查询…', 'neutral');
  ui.setToast('');
});

ui.el.btnCopyCurl.addEventListener('click', async () => {
  const input = ui.getInput();
  const token = await ensureToken(input.email, input.password);
  const url = buildRevGeocodeUrl(input);
  await copyText(getCurl({ url, token }));
});

ui.el.btnCopyMermaid.addEventListener('click', async () => copyText(ui.el.mermaid.value.trim()));
ui.el.btnCopyHelper.addEventListener('click', async () => copyText(ui.el.helper.value.trim()));
ui.el.btnCopyUsage.addEventListener('click', async () => {
  await copyText(
    [
      `// Browser / Node 18+`,
      `const res = await reverseGeocode({ lat: 1.3521, lng: 103.8198, buffer: 50, addressType: 'All', token: '<access_token>' });`,
      `console.log(res.fullAddress, res.best);`,
    ].join('\n'),
  );
});

ui.el.btnCopyJson.addEventListener('click', async () => {
  if (!lastJson) return;
  await copyText(JSON.stringify(lastJson, null, 2));
});
