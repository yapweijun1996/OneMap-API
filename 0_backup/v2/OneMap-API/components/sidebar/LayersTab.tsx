import React from 'react';
import { MapStyle } from '../../types';

interface LayersTabProps {
    currentStyle: MapStyle;
    onStyleChange: (style: MapStyle) => void;
    showPlanningAreas: boolean;
    onTogglePlanningAreas: (show: boolean) => void;
    activeThemes: string[];
    onThemeToggle: (themeId: string, active: boolean) => void;
}

const LayersTab: React.FC<LayersTabProps> = ({
    currentStyle, onStyleChange,
    showPlanningAreas, onTogglePlanningAreas,
    activeThemes, onThemeToggle
}) => {
    const availableThemes = [
        { id: 'hawkercentre', label: 'Hawker Centres' },
        { id: 'supermarkets', label: 'Supermarkets' },
        { id: 'kindergartens', label: 'Kindergartens' },
        { id: 'nationalparks', label: 'National Parks' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-gray-700 mb-2">Basemap</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(MapStyle).map(s => (
                        <button
                            key={s}
                            onClick={() => onStyleChange(s)}
                            className={`text-xs p-2 border rounded transition-colors ${currentStyle === s ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-gray-700 mb-2">Boundaries</h3>
                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={showPlanningAreas}
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
                        <label key={t.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={activeThemes.includes(t.id)}
                                onChange={(e) => onThemeToggle(t.id, e.target.checked)}
                                className="rounded text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm">{t.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LayersTab;
