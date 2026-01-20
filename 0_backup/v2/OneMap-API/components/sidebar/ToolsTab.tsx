import React, { useState } from 'react';
import { OneMapService } from '../../services/oneMapService';

interface ToolsTabProps {
    token: string;
}

const ToolsTab: React.FC<ToolsTabProps> = ({ token }) => {
    const [convLat, setConvLat] = useState('');
    const [convLng, setConvLng] = useState('');
    const [svy21Result, setSvy21Result] = useState<{ X: string, Y: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!token || !convLat || !convLng) return;
        setError(null);
        try {
            const res = await OneMapService.convertCoordinates(parseFloat(convLat), parseFloat(convLng), token);
            if (res.X && res.Y) {
                setSvy21Result({ X: res.X, Y: res.Y });
            } else {
                setError("Invalid result from API");
            }
        } catch (e) {
            setError("Conversion failed");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Coordinate Converter</h3>
            <p className="text-xs text-gray-500">Convert WGS84 (Lat/Lng) to SVY21 (X/Y) which is the standard for Singapore land surveys.</p>
            <div className="grid grid-cols-2 gap-2">
                <input
                    placeholder="Lat"
                    value={convLat}
                    onChange={e => setConvLat(e.target.value)}
                    className="border p-2 rounded text-sm"
                />
                <input
                    placeholder="Lng"
                    value={convLng}
                    onChange={e => setConvLng(e.target.value)}
                    className="border p-2 rounded text-sm"
                />
            </div>
            <button
                onClick={handleConvert}
                className="w-full bg-slate-700 text-white py-2 rounded text-sm hover:bg-slate-800 transition-colors"
            >
                Convert to SVY21
            </button>
            {error && <div className="text-xs text-red-500">{error}</div>}
            {svy21Result && (
                <div className="bg-slate-100 p-3 rounded text-sm font-mono mt-2">
                    <p>X: {svy21Result.X}</p>
                    <p>Y: {svy21Result.Y}</p>
                </div>
            )}
        </div>
    );
};

export default ToolsTab;
