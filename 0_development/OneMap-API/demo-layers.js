// Auto-extracted from demo-layers.html to keep each file <= 300 lines.
        // Initialize map
        const map = L.map('map').setView([1.3521, 103.8198], 12);
        // Base layer
        const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        // Store active layers
        const activeLayers = new Map();
        // OneMap Themes/Layers (Popular ones)
        const availableLayers = [
            {
                id: 'schools',
                name: 'Schools',
                category: 'Education',
                icon: '🏫',
                queryName: 'schools',
                description: 'Primary, secondary, and junior colleges across Singapore'
            },
            {
                id: 'parks',
                name: 'Parks & Gardens',
                category: 'Recreation',
                icon: '🌳',
                queryName: 'nationalparks',
                description: 'National parks, gardens, and green spaces'
            },
            {
                id: 'libraries',
                name: 'Public Libraries',
                category: 'Community',
                icon: '📖',
                queryName: 'libraries',
                description: 'National Library Board libraries'
            },
            {
                id: 'hawker',
                name: 'Hawker Centres',
                category: 'Food & Dining',
                icon: '🍜',
                queryName: 'hawkercentres',
                description: 'Licensed hawker centres'
            },
            {
                id: 'supermarkets',
                name: 'Supermarkets',
                category: 'Shopping',
                icon: '🛒',
                queryName: 'supermarkets',
                description: 'Major supermarket locations'
            },
            {
                id: 'childcare',
                name: 'Childcare Centres',
                category: 'Education',
                icon: '👶',
                queryName: 'childcare',
                description: 'Licensed childcare centres'
            },
            {
                id: 'eldercare',
                name: 'Eldercare Services',
                category: 'Healthcare',
                icon: '👴',
                queryName: 'eldercare',
                description: 'Eldercare and senior activity centres'
            },
            {
                id: 'dengue',
                name: 'Dengue Clusters',
                category: 'Health & Safety',
                icon: '🦟',
                queryName: 'dengue_cluster',
                description: 'Active dengue clusters (updated weekly)'
            },
            {
                id: 'carpark',
                name: 'HDB Car Parks',
                category: 'Transport',
                icon: '🅿️',
                queryName: 'hdb_car_park_information',
                description: 'HDB car park locations and information'
            },
            {
                id: 'cycling',
                name: 'Cycling Paths',
                category: 'Recreation',
                icon: '🚴',
                queryName: 'cycling_path',
                description: 'Park connector network and cycling paths'
            }
        ];
        // Render layer list
        function renderLayerList(filter = '') {
            const layerListEl = document.getElementById('layerList');
            const filtered = availableLayers.filter(layer =>
                layer.name.toLowerCase().includes(filter.toLowerCase()) ||
                layer.category.toLowerCase().includes(filter.toLowerCase())
            );
            let currentCategory = '';
            let html = '';
            filtered.forEach(layer => {
                if (layer.category !== currentCategory) {
                    if (currentCategory !== '') html += '</div>';
                    html += `<div class="mb-3">
            <div class="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2 px-2">${layer.category}</div>
          `;
                    currentCategory = layer.category;
                }
                const isActive = activeLayers.has(layer.id);
                html += `
          <div class="layer-item p-3 border-2 border-gray-200 rounded-xl cursor-pointer ${isActive ? 'layer-active' : ''}"
               data-layer-id="${layer.id}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl">${layer.icon}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-sm">${layer.name}</div>
                  <div class="text-xs text-gray-500">${layer.description}</div>
                </div>
              </div>
              ${isActive ? '<span class="text-purple-600 font-bold">✓</span>' : ''}
            </div>
          </div>
        `;
            });
            if (currentCategory !== '') html += '</div>';
            layerListEl.innerHTML = html;
            // Add click handlers
            document.querySelectorAll('.layer-item').forEach(item => {
                item.addEventListener('click', () => {
                    const layerId = item.dataset.layerId;
                    toggleLayer(layerId);
                });
            });
        }
        // Toggle layer
        async function toggleLayer(layerId) {
            const layer = availableLayers.find(l => l.id === layerId);
            if (!layer) return;
            if (activeLayers.has(layerId)) {
                // Remove layer
                const layerGroup = activeLayers.get(layerId);
                map.removeLayer(layerGroup);
                activeLayers.delete(layerId);
            } else {
                // Add layer
                try {
                    const layerGroup = await fetchAndDisplayLayer(layer);
                    activeLayers.set(layerId, layerGroup);
                } catch (error) {
                    console.error('Failed to load layer:', error);
                    alert(`Failed to load ${layer.name}. This layer may not be available via the public API.`);
                }
            }
            renderLayerList(document.getElementById('layerSearch').value);
            updateActiveLayersInfo();
        }
        // Fetch and display layer (Demo with markers)
        async function fetchAndDisplayLayer(layer) {
            // Note: This is a simplified demo. Real implementation would use OneMap's Theme API
            // For demo purposes, we'll create sample markers
            const layerGroup = L.layerGroup().addTo(map);
            // Demo: Create sample points (in real app, fetch from OneMap API)
            const samplePoints = generateSamplePoints(layer);
            samplePoints.forEach(point => {
                const marker = L.marker([point.lat, point.lng], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="font-size: 24px;">${layer.icon}</div>`,
                        iconSize: [30, 30]
                    })
                });
                marker.bindPopup(`
          <div class="p-2">
            <div class="font-bold text-lg mb-1">${layer.icon} ${point.name}</div>
            <div class="text-sm text-gray-600">${layer.name}</div>
            <div class="text-xs text-gray-500 mt-1">📍 ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</div>
          </div>
        `);
                marker.addTo(layerGroup);
            });
            return layerGroup;
        }
        // Generate sample points for demo
        function generateSamplePoints(layer) {
            const points = [];
            const centerLat = 1.3521;
            const centerLng = 103.8198;
            const count = Math.floor(Math.random() * 8) + 5; // 5-12 points
            for (let i = 0; i < count; i++) {
                points.push({
                    name: `${layer.name} ${i + 1}`,
                    lat: centerLat + (Math.random() - 0.5) * 0.1,
                    lng: centerLng + (Math.random() - 0.5) * 0.1
                });
            }
            return points;
        }
        // Update active layers info
        function updateActiveLayersInfo() {
            const infoEl = document.getElementById('activeLayersInfo');
            const listEl = document.getElementById('activeLayersList');
            if (activeLayers.size === 0) {
                infoEl.classList.add('hidden');
                return;
            }
            infoEl.classList.remove('hidden');
            let html = '';
            activeLayers.forEach((layerGroup, layerId) => {
                const layer = availableLayers.find(l => l.id === layerId);
                html += `
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-purple-200 rounded-lg text-sm">
            <span>${layer.icon}</span>
            <span class="font-medium">${layer.name}</span>
            <button class="ml-1 text-purple-600 hover:text-purple-800" onclick="toggleLayer('${layerId}')">✕</button>
          </span>
        `;
            });
            listEl.innerHTML = html;
        }
        // Event listeners
        document.getElementById('layerSearch').addEventListener('input', (e) => {
            renderLayerList(e.target.value);
        });
        document.getElementById('btnClearLayers').addEventListener('click', () => {
            activeLayers.forEach((layerGroup, layerId) => {
                map.removeLayer(layerGroup);
            });
            activeLayers.clear();
            renderLayerList(document.getElementById('layerSearch').value);
            updateActiveLayersInfo();
        });
        // Initialize
        renderLayerList();
        // Add info about API limitation
        setTimeout(() => {
            const layerDetailsEl = document.getElementById('layerDetails');
            const layerDetailsContentEl = document.getElementById('layerDetailsContent');
            layerDetailsContentEl.innerHTML = `
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p class="font-semibold text-yellow-900 mb-2">ℹ️ Demo Mode</p>
          <p class="text-sm text-yellow-800 mb-2">
            This demo shows sample data points. In a production environment, you would:
          </p>
          <ul class="text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li>Use OneMap's <strong>Themes API</strong> to fetch real data</li>
            <li>Implement proper authentication with API tokens</li>
            <li>Handle pagination for large datasets</li>
            <li>Add filtering and search capabilities</li>
            <li>Display actual government data from various sources</li>
          </ul>
          <p class="text-sm text-yellow-800 mt-2">
            <strong>API Endpoint:</strong> <code class="bg-yellow-100 px-2 py-1 rounded">https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme</code>
          </p>
        </div>
        <div class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <p class="font-semibold text-purple-900 mb-2">📚 Available Theme Categories</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-purple-800">
            <div>• Education (Schools, Childcare)</div>
            <div>• Healthcare (Hospitals, Clinics)</div>
            <div>• Recreation (Parks, Sports)</div>
            <div>• Transport (MRT, Bus Stops)</div>
            <div>• Community (Libraries, CCs)</div>
            <div>• Safety (Police, Fire Stations)</div>
            <div>• Planning (URA Master Plan)</div>
            <div>• Environment (Dengue, Weather)</div>
          </div>
        </div>
      `;
            layerDetailsEl.classList.remove('hidden');
        }, 1000);
window.toggleLayer = toggleLayer;
