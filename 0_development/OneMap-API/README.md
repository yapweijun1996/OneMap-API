# OneMap API Explorer（可維護的 OneMap Dashboard / Demo）

目標：把 OneMap API 做成「好用、好維護、工程師可直接 copy/paste」的 Explorer + Demo 範例集。

## 快速入口

- Dashboard：`/index.html`
- Explorer（React + Leaflet）：`/app.html`
- Demo Hub（每個功能一個 `.html`）：`/demo/index.html`
- Demo 目錄說明：`demo/README.md`

## 本機執行

**Prerequisites：** Node.js

1. 安裝依賴：`npm install`
2. 啟動：`npm run dev`
3. 打開：
   - `http://localhost:3000/`
   - `http://localhost:3000/demo/index.html`

## Copy/Paste 使用方式（工程師友善）

### 1) 只想要某個功能的最小範例

到 `demo/` 找對應的單頁 demo，直接把 `demo/*.html` 複製到你的專案即可（不依賴本 repo 的 React）。

### 2) 需要共用 helper（可選）

你也可以直接複製：

- `demo/onemap-client.js`
- `demo/onemap-revgeocode.js`

## 常見問題（FAQ）

### 401 Unauthorized

有些 endpoint 需要 JWT token：請先用 `demo/auth-token.html` 取得 `access_token`，再貼到對應 demo 的 token 欄位。

### file:// 打不開 / module 被擋

請用 `npm run dev` 或靜態伺服器（例如 `python -m http.server`）開啟，不要直接 `file://`。

## 專案結構（高階）

```mermaid
flowchart TD
  A[index.html Dashboard] --> B[app.html Explorer]
  A --> C[demo/index.html Demo Hub]
  C --> D[demo/*.html (1 feature = 1 page)]
  B --> E[services/oneMapService.ts]
```

