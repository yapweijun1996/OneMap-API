import React, { useState } from 'react';
import { OneMapSearchResult } from '../../types';
import { OneMapService } from '../../services/oneMapService';

interface SearchTabProps {
    token: string;
    onLocationSelect: (loc: OneMapSearchResult) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ token, onLocationSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<OneMapSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await OneMapService.search(searchQuery, token);
            setSearchResults(data.results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Address / Lat,Lng"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button type="submit" className="bg-gray-100 px-3 rounded border hover:bg-gray-200">🔍</button>
            </form>

            {loading && <div className="text-sm text-gray-500">Searching...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="space-y-2">
                {searchResults.map((res, i) => (
                    <div
                        key={i}
                        onClick={() => onLocationSelect(res)}
                        className="p-2 border rounded hover:bg-red-50 cursor-pointer transition-colors"
                    >
                        <div className="font-semibold text-sm">{res.SEARCHVAL}</div>
                        <div className="text-xs text-gray-500">{res.ADDRESS}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchTab;
