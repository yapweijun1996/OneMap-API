import React, { useState } from 'react';
import { LatLng } from '../../types';

interface RouteTabProps {
    startPoint: LatLng | null;
    endPoint: LatLng | null;
    onCalculateRoute: (mode: 'drive' | 'walk' | 'cycle') => void;
    routeSummary: any;
}

const RouteTab: React.FC<RouteTabProps> = ({
    startPoint, endPoint, onCalculateRoute, routeSummary
}) => {
    const [routeMode, setRouteMode] = useState<'drive' | 'walk' | 'cycle'>('drive');

    return (
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
                {(['drive', 'walk', 'cycle'] as const).map(m => (
                    <button
                        key={m}
                        onClick={() => setRouteMode(m)}
                        className={`flex-1 py-1 rounded text-sm capitalize border transition-colors ${routeMode === m ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onCalculateRoute(routeMode)}
                disabled={!startPoint || !endPoint}
                className="w-full py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 font-medium hover:bg-blue-700 transition-colors"
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
    );
};

export default RouteTab;
