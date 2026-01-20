# OneMap API Demo Pages

This folder contains standalone demo pages for each OneMap API feature. Each demo is a self-contained HTML file that can be opened independently.

## 📁 Demo Files

### 1. **demo-search.html** - Location Search
- **Feature**: Search for addresses, postal codes, buildings, and landmarks
- **API Used**: OneMap Elastic Search API
- **Highlights**:
  - Interactive search with live results
  - Map visualization with markers
  - Quick example buttons
  - Result pagination support

### 2. **demo-routing.html** - Routing & Navigation
- **Feature**: Calculate routes for driving, walking, cycling, and public transport
- **API Used**: OneMap Routing Service API
- **Highlights**:
  - Multiple route types (drive/walk/cycle/pt)
  - Turn-by-turn directions
  - Route summary (distance, time)
  - Interactive map with route visualization
  - Swap start/end points

### 3. **demo-layers.html** - Data Layers & Themes
- **Feature**: Visualize thematic data layers from government sources
- **API Used**: OneMap Themes API (demo mode)
- **Highlights**:
  - 10+ popular layer categories
  - Layer search and filtering
  - Interactive map with layer toggles
  - Multiple active layers support
  - **Note**: Currently in demo mode with sample data

### 4. **demo-tools.html** - Coordinate Conversion Tools
- **Feature**: Convert coordinates between WGS84, SVY21, and EPSG:3857
- **API Used**: OneMap Coordinate Conversion API
- **Highlights**:
  - WGS84 ↔ SVY21 conversion
  - Batch conversion support
  - Copy to clipboard functionality
  - Quick example buttons
  - API reference documentation

## 🚀 How to Run

### Option A: Using Vite Dev Server (Recommended)

```bash
npm install
npm run dev
```

Then open:
- http://localhost:5173/demo-search.html
- http://localhost:5173/demo-routing.html
- http://localhost:5173/demo-layers.html
- http://localhost:5173/demo-tools.html

### Option B: Using Python HTTP Server

```bash
python -m http.server 8000
```

Then open:
- http://localhost:8000/demo-search.html
- http://localhost:8000/demo-routing.html
- http://localhost:8000/demo-layers.html
- http://localhost:8000/demo-tools.html

### Option C: Direct File Opening

⚠️ **Not recommended** - Some features may not work due to CORS restrictions when opening files directly with `file://` protocol.

## 🎨 Design Features

All demo pages include:
- ✅ Modern, premium UI design with gradients and animations
- ✅ Responsive layout (mobile-friendly)
- ✅ Interactive Leaflet maps
- ✅ Real OneMap API integration
- ✅ Error handling and user feedback
- ✅ Quick example buttons for testing
- ✅ Back to Dashboard navigation

## 📚 Technology Stack

- **HTML5** - Structure
- **Tailwind CSS** (CDN) - Styling
- **Vanilla JavaScript** - Logic
- **Leaflet.js** - Map visualization
- **OneMap API** - Data source

## 🔗 Related Files

- **index.html** - Main dashboard with links to all demos
- **app.html** - Full React SPA application (alternative interface)
- **demo/** folder - Additional demos (coordinate-to-address, reverse-geocode)

## 📖 API Documentation

For detailed API documentation, visit:
- [OneMap API Documentation](https://www.onemap.gov.sg/apidocs/)
- [OneMap Developer Portal](https://www.onemap.gov.sg/main/v2/)

## ⚠️ Important Notes

1. **API Rate Limits**: OneMap API has rate limits. Avoid excessive requests.
2. **Authentication**: Some APIs require authentication tokens. The demos use public endpoints where possible.
3. **CORS**: When running locally, use a local server (not direct file opening) to avoid CORS issues.
4. **Data Accuracy**: Demo data is for demonstration purposes. Always verify critical data with official sources.

## 🛠️ Customization

Each demo file is self-contained and can be customized independently:
- Modify colors by changing Tailwind classes
- Adjust map settings in the Leaflet initialization
- Add new features by extending the JavaScript code
- Update API parameters to explore different options

## 📝 License

This project demonstrates the usage of OneMap API. Please refer to [OneMap Terms of Use](https://www.onemap.gov.sg/legal/termsofuse.html) for API usage guidelines.

---

**Created**: 2026-01-20  
**Last Updated**: 2026-01-20  
**Version**: 1.0.0
