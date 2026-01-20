# OneMap Demo（Copy/Paste 範例集）

這個資料夾提供「每個功能一個獨立 `.html`」的 OneMap Demo，工程師可以直接複製到自己的專案使用。

> 安全提醒：需要 token 的 API，請避免在生產前端直接使用帳號/密碼；建議由後端安全取得 token 後再供前端呼叫。

## 本機打開方式

### 方式 A：用本專案 Vite（推薦）

1. `npm install`
2. `npm run dev`
3. 打開：`http://localhost:3000/demo/index.html`

### 方式 B：用任何靜態伺服器（避免 file:// module 限制）

在專案根目錄：

- `python -m http.server 8000`
- 打開：`http://localhost:8000/demo/index.html`

## Demo 目錄（1 功能 = 1 HTML）

### Auth

- `demo/auth-token.html`：取得 JWT token（`POST /api/auth/post/getToken`）

### Search & Geocoding

- `demo/search.html`：Elastic Search（`GET /api/common/elastic/search`，通常需要 token）
- `demo/reverse-geocode.html`：Reverse Geocode（`GET /api/public/revgeocode`）
- `demo/reverse-geocode-engineer.html`：Reverse Geocode 工程师手册（Copy/Paste + 参数/回传说明）
- `demo/coordinate-to-address.html`：Reverse Geocode（純前端版本，包含 copy 按鈕與定位）

### Routing

- `demo/routing.html`：Drive / Walk / Cycle（`GET /api/public/routingsvc/route`）
- `demo/public-transport-routing.html`：Public Transport（`GET /api/public/routingsvc/route?routeType=pt`，需 token）

### Transport Nearby

- `demo/nearby-transport.html`：附近 Bus/MRT（
  `GET /api/public/nearbysvc/getNearestBusStops`、
  `GET /api/public/nearbysvc/getNearestMrtStops`
  ）

### Data & Boundaries

- `demo/themes.html`：Themes（`GET /api/public/themesvc/retrieveTheme?queryName=...`）
- `demo/planning-area-2024.html`：Planning Areas 2024（`GET /api/public/planningarea?year=2024`）
- `demo/population-query.html`：Population Query（`GET /api/public/popapi/*`，示例：Age Group / Economic Status）

### Tools & Maps

- `demo/convert-4326-to-3414.html`：WGS84 → SVY21（`GET /api/common/convert/4326to3414`）
- `demo/static-map.html`：Static Map（`GET /api/staticmap/getStaticImage`，生成 PNG URL + 预览）
- `demo/basemap-tiles.html`：Basemap Tiles（Leaflet + `https://www.onemap.gov.sg/maps/tiles/{style}/{z}/{x}/{y}.png`）
- `demo/minimap.html`：Minimap Embed（生成 iframe：`https://www.onemap.gov.sg/minimap/?...`）

## Copy/Paste 指引（工程師最常用）

### 1) 只想複製一頁到別的專案

直接帶走對應的 `demo/*.html` 檔案即可（這些頁面沒有依賴本 repo 的 React 程式）。

### 2) 需要共用的 helper（可選）

- `demo/onemap-client.js`：提供 `getOneMapToken()` 等 fetch helper（可直接 copy）
- `demo/onemap-revgeocode.js`：reverse geocode 的封裝 + normalize（可直接 copy）

> 其他 demo 頁目前是「單檔可攜」風格（HTML 內建 JS），目的是方便工程師快速複製。

## 常見問題（FAQ）

### 401 Unauthorized

部分 endpoint 需要 token：

- 先開 `demo/auth-token.html` 取得 `access_token`
- 再把 token 貼到 demo 頁的 Token 欄位（若該頁有）

### file:// 打不開 / module 被擋

請用 `npm run dev` 或 `python -m http.server` 方式提供靜態站點，不要直接用 `file://` 開。
