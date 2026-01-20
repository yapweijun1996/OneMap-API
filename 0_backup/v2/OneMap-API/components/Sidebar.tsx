import React, { useEffect, useState } from 'react';
import { OneMapSearchResult, MapStyle, LatLng } from '../types';
import LoginView from './sidebar/LoginView';
import SearchTab from './sidebar/SearchTab';
import RouteTab from './sidebar/RouteTab';
import LayersTab from './sidebar/LayersTab';
import ToolsTab from './sidebar/ToolsTab';
import DashboardView from './sidebar/DashboardView';

interface SidebarProps {
  token: string | null;
  onLogin: (email: string, pass: string) => Promise<void>;
  onLogout: () => void;
  onLocationSelect: (loc: OneMapSearchResult) => void;
  onStyleChange: (style: MapStyle) => void;
  currentStyle: MapStyle;
  // Routing props
  startPoint: LatLng | null;
  endPoint: LatLng | null;
  onCalculateRoute: (mode: 'drive' | 'walk' | 'cycle') => void;
  routeSummary: any;
  // Theme & Layers props
  onThemeToggle: (theme: string, active: boolean) => void;
  activeThemes: string[];
  showPlanningAreas: boolean;
  onTogglePlanningAreas: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  token, onLogin, onLogout, onLocationSelect, onStyleChange, currentStyle,
  startPoint, endPoint, onCalculateRoute, routeSummary,
  onThemeToggle, activeThemes, showPlanningAreas, onTogglePlanningAreas
}) => {
  type Tab = 'dashboard' | 'search' | 'route' | 'layers' | 'tools';

  const parseHashToTab = (hash: string): Tab => {
    const raw = (hash || '').replace('#', '').trim().toLowerCase();
    if (raw === 'search' || raw === 'route' || raw === 'layers' || raw === 'tools') return raw;
    return 'dashboard';
  };

  const clearHash = () => {
    const urlWithoutHash = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, '', urlWithoutHash);
  };

  const [activeTab, setActiveTab] = useState<Tab>(() => parseHashToTab(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setActiveTab(parseHashToTab(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      clearHash();
      return;
    }
    window.location.hash = tab;
  };

  if (!token) {
    return <LoginView onLogin={onLogin} />;
  }

  const isDashboard = activeTab === 'dashboard';

  return (
    <div className={`${isDashboard ? 'w-screen' : 'w-96'} h-full bg-white shadow-xl flex flex-col z-20 absolute left-0 top-0 border-r border-gray-200 transition-all duration-300 ease-in-out`}>
      <div className="p-4 bg-red-600 text-white">
        <div className="flex justify-between items-center">
          <h1
            className="text-xl font-bold cursor-pointer hover:text-red-200 transition-colors"
            onClick={() => navigate('dashboard')}
            title="Back to Dashboard"
          >
            OneMap Explorer
          </h1>
          <button
            onClick={onLogout}
            className="text-xs bg-red-700 px-2 py-1 rounded hover:bg-red-800"
            title="Logout"
          >
            Logout
          </button>
        </div>
        <div className="flex text-xs space-x-2 mt-2 font-medium overflow-x-auto pb-1">
          {['search', 'route', 'layers', 'tools'].map(tab => (
            <button key={tab} onClick={() => navigate(tab as any)} className={`uppercase px-2 py-1 rounded ${activeTab === tab ? 'bg-white text-red-600' : 'text-red-100'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'dashboard' && <DashboardView onNavigate={(t) => navigate(t)} />}
        {activeTab === 'search' && <SearchTab token={token} onLocationSelect={onLocationSelect} />}

        {activeTab === 'route' && (
          <RouteTab
            startPoint={startPoint}
            endPoint={endPoint}
            onCalculateRoute={onCalculateRoute}
            routeSummary={routeSummary}
          />
        )}

        {activeTab === 'layers' && (
          <LayersTab
            currentStyle={currentStyle}
            onStyleChange={onStyleChange}
            showPlanningAreas={showPlanningAreas}
            onTogglePlanningAreas={onTogglePlanningAreas}
            activeThemes={activeThemes}
            onThemeToggle={onThemeToggle}
          />
        )}

        {activeTab === 'tools' && <ToolsTab token={token} />}
      </div>
    </div>
  );
};

export default Sidebar;
