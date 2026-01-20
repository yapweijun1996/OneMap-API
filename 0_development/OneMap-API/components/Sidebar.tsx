import React, { useState } from 'react';
import { OneMapSearchResult, MapStyle, LatLng } from '../types';
import { OneMapService } from '../services/oneMapService';

interface SidebarProps {
  token: string | null;
  onLogin: (email: string, pass: string) => Promise<void>;
  onLocationSelect: (loc: OneMapSearchResult) => void;
  onStyleChange: (style: MapStyle) => void;
  currentStyle: MapStyle;
  // Routing props
  startPoint: LatLng | null;
  endPoint: LatLng | null;
  onCalculateRoute: (mode: 'drive'|'walk'|'cycle') => void;
  routeSummary: any;
  // Theme & Layers props
  onThemeToggle: (theme: string, active: boolean) => void;
  activeThemes: string[];
  showPlanningAreas: boolean;
  onTogglePlanningAreas: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  token, onLogin, onLocationSelect, onStyleChange, currentStyle,
  startPoint, endPoint, onCalculateRoute, routeSummary,
  onThemeToggle, activeThemes, showPlanningAreas, onTogglePlanningAreas
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OneMapSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'route' | 'layers' | 'tools'>('search');
  const [routeMode, setRouteMode] = useState<'drive'|'walk'|'cycle'>('drive');
  
  // Converter State
  const [convLat, setConvLat] = useState('');
  const [convLng, setConvLng] = useState('');
  const [svy21Result, setSvy21Result] = useState<{X: string, Y: string} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const data = await OneMapService.search(searchQuery, token);
      setSearchResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if(!token || !convLat || !convLng) return;
    try {
      const res = await OneMapService.convertCoordinates(parseFloat(convLat), parseFloat(convLng), token);
      if(res.X && res.Y) setSvy21Result({ X: res.X, Y: res.Y });
    } catch (e) {
      setError("Conversion failed");
    }
  };

  const availableThemes = [
    { id: 'hawkercentre', label: 'Hawker Centres' },
    { id: 'supermarkets', label: 'Supermarkets' },
    { id: 'kindergartens', label: 'Kindergartens' },
    { id: 'nationalparks', label: 'National Parks' }
  ];

  if (!token) {
    return (
      <div className="w-80 h-full bg-white shadow-xl p-6 flex flex-col z-20 absolute left-0 top-0 overflow-y-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-2">OneMap SG</h2>
        <p className="text-sm text-gray-500 mb-6">Authoritative National Map</p>
        <div className="bg-blue-50 p-4 rounded text-xs text-blue-800 mb-4">
          Token Required. Please Login.
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Password" required />
          <button type="submit" disabled={loading} className="w-full py-2 bg-red-600 text-white rounded">
            {loading ? '...' : 'Login'}
          </button>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="w-96 h-full bg-white shadow-xl flex flex-col z-20 absolute left-0 top-0 border-r border-gray-200">
      <div className="p-4 bg-red-600 text-white">
        <h1 className="text-xl font-bold">OneMap Explorer</h1>
        <div className="flex text-xs space-x-2 mt-2 font-medium overflow-x-auto pb-1">
          {['search', 'route', 'layers', 'tools'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`uppercase px-2 py-1 rounded ${activeTab === tab ? 'bg-white text-red-600' : 'text-red-100'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'search' && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Address / Lat,Lng" className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button type="submit" className="bg-gray-100 px-3 rounded border">🔍</button>
            </form>
            {loading && <div className="text-sm text-gray-500">Searching...</div>}
            <div className="space-y-2">
              {searchResults.map((res, i) => (
                <div key={i} onClick={() => onLocationSelect(res)} className="p-2 border rounded hover:bg-red-50 cursor-pointer">
                  <div className="font-semibold text-sm">{res.SEARCHVAL}</div>
                  <div className="text-xs text-gray-500">{res.ADDRESS}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded space-y-2 border">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 text-green-600 font-bold">Start</span>
                <div className="flex-1 p-2 bg-white border rounded text-gray-600 truncate">
                  {startPoint ? `${startPoint.lat.toFixed(4)}, ${startPoint.lng.toFixed(4)}` : 'Click Map'}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 text-red-600 font-bold">End</span>
                <div className="flex-1 p-2 bg-white border rounded text-gray-600 truncate">
                  {endPoint ? `${endPoint.lat.toFixed(4)}, ${endPoint.lng.toFixed(4)}` : 'Click Map'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {['drive', 'walk', 'cycle'].map(m => (
                <button 
                  key={m} onClick={() => setRouteMode(m as any)}
                  className={`flex-1 py-1 rounded text-sm capitalize border ${routeMode === m ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button 
              onClick={() => onCalculateRoute(routeMode)} disabled={!startPoint || !endPoint}
              className="w-full py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 font-medium"
            >
              Directions
            </button>
            {routeSummary && (
              <div className="bg-green-50 p-3 rounded border border-green-200 text-sm">
                <p><strong>Time:</strong> {Math.round(routeSummary.total_time / 60)} mins</p>
                <p><strong>Dist:</strong> {(routeSummary.total_distance / 1000).toFixed(2)} km</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Basemap</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(MapStyle).map(s => (
                  <button 
                    key={s} onClick={() => onStyleChange(s)}
                    className={`text-xs p-2 border rounded ${currentStyle === s ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Boundaries</h3>
              <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="checkbox" checked={showPlanningAreas}
                  onChange={(e) => onTogglePlanningAreas(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-semibold">URA Planning Areas (2024)</span>
              </label>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Amenities</h3>
              <div className="space-y-2">
                {availableThemes.map(t => (
                  <label key={t.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" checked={activeThemes.includes(t.id)}
                      onChange={(e) => onThemeToggle(t.id, e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Coordinate Converter</h3>
            <p className="text-xs text-gray-500">Convert WGS84 (Lat/Lng) to SVY21 (X/Y) which is the standard for Singapore land surveys.</p>
            <div className="grid grid-cols-2 gap-2">
               <input placeholder="Lat" value={convLat} onChange={e => setConvLat(e.target.value)} className="border p-2 rounded text-sm"/>
               <input placeholder="Lng" value={convLng} onChange={e => setConvLng(e.target.value)} className="border p-2 rounded text-sm"/>
            </div>
            <button onClick={handleConvert} className="w-full bg-slate-700 text-white py-2 rounded text-sm">Convert to SVY21</button>
            {svy21Result && (
              <div className="bg-slate-100 p-3 rounded text-sm font-mono mt-2">
                <p>X: {svy21Result.X}</p>
                <p>Y: {svy21Result.Y}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;