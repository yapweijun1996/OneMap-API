import React from 'react';

interface DashboardViewProps {
    onNavigate: (tab: 'search' | 'route' | 'layers' | 'tools') => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
    const features = [
        {
            id: 'search',
            title: 'Search',
            desc: 'Find addresses & postal codes',
            color: 'bg-blue-600',
            icon: '🔍'
        },
        {
            id: 'route',
            title: 'Routing',
            desc: 'Drive, Walk, Cycle & Transit',
            color: 'bg-green-600',
            icon: 'directions'
        },
        {
            id: 'layers',
            title: 'Themes',
            desc: 'Amenities, Schools & Land',
            color: 'bg-purple-600',
            icon: 'layers'
        },
        {
            id: 'tools',
            title: 'Tools',
            desc: 'Converters & Utilities',
            color: 'bg-orange-600',
            icon: 'build'
        }
    ];

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50/50">
            <div className="w-full max-w-2xl p-4 space-y-6 animate-fade-in">
                <div className="border-b pb-4 border-gray-200 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">OneMap Explorer</h2>
                    <p className="text-gray-500 mt-2">Access Singapore's authoritative map data</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map(f => (
                        <button
                            key={f.id}
                            onClick={() => onNavigate(f.id as any)}
                            className="group relative overflow-hidden bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all text-left"
                        >
                            {/* Color Accent */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${f.color}`} />

                            <div className="flex items-start justify-between pl-2">
                                <div>
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${f.color.replace('bg-', 'text-')}`}>
                                        {f.title}
                                    </div>
                                    <div className="font-semibold text-gray-800 text-xl mb-1">{f.id.charAt(0).toUpperCase() + f.id.slice(1)}</div>
                                    <p className="text-sm text-gray-500">{f.desc}</p>
                                </div>
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${f.color} bg-opacity-10 text-xl group-hover:scale-110 transition-transform`}>
                                    {f.icon === 'directions' ? '🚗' : f.icon === 'layers' ? '📚' : f.icon === 'build' ? '🛠️' : f.icon}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center text-xs text-gray-400 mt-8">
                    OneMap API Explorer v2.0 • Data provided by SLA
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
