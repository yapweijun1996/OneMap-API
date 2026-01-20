# OneMap API Explorer

A comprehensive toolkit for exploring and integrating the [OneMap API](https://www.onemap.gov.sg/docs/) (Singapore's authoritative map data).

This project serves two purposes:
1.  **Interactive Explorer**: A feature-rich React application to test API capabilities visually.
2.  **Developer Demos**: Simplified, standalone HTML/JS examples for easy "copy-paste" integration.

## 🚀 Quick Start

### Prerequisites
- Node.js installed.

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Access the dashboard at `http://localhost:5173/` (or whichever port Vite uses, usually 5173).

## 📂 Project Structure

- **`/index.html`**: The main landing dashboard linking to all demos and the React app.
- **`/app.html`**: Entry point for the full **React Explorer App**.
- **`/demo/*.html`**: Independent, standalone examples for specific API features.
- **`/src`**: Source code for the React Explorer.

## ✨ Features

### 1. React Explorer (Detailed Integration)
Located at `/app.html` (accessible via Dashboard).
-   **Authentication**: Token generation and persistence.
-   **Search**: Elastic search for addresses and postal codes.
-   **Routing**: Navigation for Drive, Walk, and Cycle.
-   **Layers**: View Planning Areas and various Themes (e.g., Kindergartens, Parks).
-   **Reverse Geocoding**: Click on the map to get address details.
-   **Map Styles**: Switch between Original, Grey, Night, and other base maps.

### 2. Standalone Demos (Copy-Paste Ready)
Located in the `demo/` folder. Designed to be minimal and dependency-free where possible.

| Feature | File | Description |
|---------|------|-------------|
| **Search** | `demo/search.html` | Basic address search implementation. |
| **Routing** | `demo/routing.html` | Public transport and driving route calculations. |
| **Themes** | `demo/themes.html` | Display data overlays and themes. |
| **Boundaries** | `demo/planning-area-2024.html` | Planning Areas (2024) visualization. |
| **Coords** | `demo/convert-4326-to-3414.html` | Coordinate conversion (WGS84 ↔ SVY21). |
| **Reverse Geocode** | `demo/reverse-geocode.html` | Click-to-address functionality. |
| **Static Map** | `demo/static-map.html` | Generating static map images. |
| **Population** | `demo/population-query.html` | Query demographic data. |

## 🛠 Tech Stack

-   **Frontend Framework**: React 19, Vite
-   **Maps**: Leaflet, React-Leaflet
-   **Styling**: Tailwind CSS, Vanilla CSS
-   **Language**: TypeScript, HTML5, JavaScript

## 📝 License
This project is for educational and development purposes, demonstrating the usage of Singapore Land Authority's OneMap API.
