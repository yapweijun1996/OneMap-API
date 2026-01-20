import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import { OneMapSearchResult, MapStyle, LatLng, ThemeItem, PlanningAreaFeature } from './types';
import { OneMapService } from './services/oneMapService';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([1.3521, 103.8198]);
  const [zoom, setZoom] = useState<number>(12);
  const [selectedLocation, setSelectedLocation] = useState<OneMapSearchResult | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>(MapStyle.DEFAULT);

  // Routing State
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [routeSummary, setRouteSummary] = useState<any>(null);

  // Theme & Layers State
  const [activeThemes, setActiveThemes] = useState<string[]>([]);
  const [themeItems, setThemeItems] = useState<ThemeItem[]>([]);
  const [clickedAddress, setClickedAddress] = useState<string | null>(null);
  const [planningAreas, setPlanningAreas] = useState<PlanningAreaFeature[]>([]);
  const [showPlanningAreas, setShowPlanningAreas] = useState(false);

  const handleLogin = async (email: string, pass: string) => {
    const data = await OneMapService.login(email, pass);
    setToken(data.access_token);
  };

  const handleLocationSelect = (loc: OneMapSearchResult) => {
    setSelectedLocation(loc);
    setMapCenter([parseFloat(loc.LATITUDE), parseFloat(loc.LONGITUDE)]);
    setZoom(17);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (!token) return;

    // Toggle start/end points logic
    if (!startPoint) {
      setStartPoint({ lat, lng });
    } else if (!endPoint) {
      setEndPoint({ lat, lng });
      try {
        const rev = await OneMapService.reverseGeocode(lat, lng, token);
        const info = rev.GeocodeInfo[0];
        setClickedAddress(`${info.BLOCK} ${info.ROAD} ${info.BUILDINGNAME}`);
      } catch (e) {
        setClickedAddress("Unknown Location");
      }
    } else {
      setStartPoint({ lat, lng });
      setEndPoint(null);
      setRouteGeometry(null);
      setRouteSummary(null);
    }
  };

  const calculateRoute = async (mode: 'drive' | 'walk' | 'cycle') => {
    if (!token || !startPoint || !endPoint) return;
    const data = await OneMapService.getRoute(startPoint, endPoint, mode, token);
    if (data) {
      setRouteGeometry(data.geometry);
      setRouteSummary(data.summary);
      setMapCenter([(startPoint.lat + endPoint.lat)/2, (startPoint.lng + endPoint.lng)/2]);
      setZoom(13);
    }
  };

  const toggleTheme = async (themeName: string, active: boolean) => {
    if (!token) return;
    let newThemes = active ? [...activeThemes, themeName] : activeThemes.filter(t => t !== themeName);
    setActiveThemes(newThemes);

    if (active) {
      const data = await OneMapService.getTheme(themeName, token);
      setThemeItems(prev => [...prev, ...data.SrchResults]);
    } else {
      const freshItems: ThemeItem[] = [];
      for (const t of newThemes) {
         const data = await OneMapService.getTheme(t, token);
         freshItems.push(...data.SrchResults);
      }
      setThemeItems(freshItems);
    }
  };

  const togglePlanningAreas = async (show: boolean) => {
    if (!token) return;
    setShowPlanningAreas(show);
    if (show && planningAreas.length === 0) {
      try {
        const data = await OneMapService.getPlanningAreas(token);
        setPlanningAreas(data.features || []);
      } catch (e) {
        console.error("Failed to load planning areas", e);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-gray-100">
      <Sidebar 
        token={token}
        onLogin={handleLogin}
        onLocationSelect={handleLocationSelect}
        onStyleChange={setMapStyle}
        currentStyle={mapStyle}
        // Routing
        startPoint={startPoint}
        endPoint={endPoint}
        onCalculateRoute={calculateRoute}
        routeSummary={routeSummary}
        // Themes
        onThemeToggle={toggleTheme}
        activeThemes={activeThemes}
        // Layers
        showPlanningAreas={showPlanningAreas}
        onTogglePlanningAreas={togglePlanningAreas}
      />

      <div className="flex-1 relative h-full">
        <MapComponent 
          center={mapCenter}
          zoom={zoom}
          activeLocation={selectedLocation}
          mapStyle={mapStyle}
          startPoint={startPoint}
          endPoint={endPoint}
          routeGeometry={routeGeometry}
          onMapClick={handleMapClick}
          themeItems={themeItems}
          clickedAddress={clickedAddress}
          planningAreas={planningAreas}
          showPlanningAreas={showPlanningAreas}
        />
      </div>
    </div>
  );
};

export default App;