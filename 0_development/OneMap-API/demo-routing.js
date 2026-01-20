// Auto-extracted from demo-routing.html to keep each file <= 300 lines.
        // Initialize map
        const map = L.map('map').setView([1.3521, 103.8198], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        let routeLayer = null;
        let startMarker = null;
        let endMarker = null;

        // Elements
        const startLatEl = document.getElementById('startLat');
        const startLngEl = document.getElementById('startLng');
        const endLatEl = document.getElementById('endLat');
        const endLngEl = document.getElementById('endLng');
        const routeTypeEl = document.getElementById('routeType');
        const btnRoute = document.getElementById('btnRoute');
        const btnSwap = document.getElementById('btnSwap');
        const btnClear = document.getElementById('btnClear');
        const errorMsgEl = document.getElementById('errorMsg');
        const routeSummaryEl = document.getElementById('routeSummary');
        const summaryContentEl = document.getElementById('summaryContent');
        const directionsPanelEl = document.getElementById('directionsPanel');
        const directionsContentEl = document.getElementById('directionsContent');

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const [startLat, startLng] = btn.dataset.start.split(',');
                const [endLat, endLng] = btn.dataset.end.split(',');
                startLatEl.value = startLat;
                startLngEl.value = startLng;
                endLatEl.value = endLat;
                endLngEl.value = endLng;
                getRoute();
            });
        });

        // Get route function
        async function getRoute() {
            const startLat = parseFloat(startLatEl.value);
            const startLng = parseFloat(startLngEl.value);
            const endLat = parseFloat(endLatEl.value);
            const endLng = parseFloat(endLngEl.value);

            if (!startLat || !startLng || !endLat || !endLng) {
                showError('Please enter valid start and end coordinates');
                return;
            }

            errorMsgEl.classList.add('hidden');
            btnRoute.disabled = true;
            btnRoute.textContent = '🔄 Calculating Route...';

            try {
                const params = new URLSearchParams({
                    start: `${startLat},${startLng}`,
                    end: `${endLat},${endLng}`,
                    routeType: routeTypeEl.value
                });

                const response = await fetch(`https://www.onemap.gov.sg/api/public/routingsvc/route?${params}`);
                const data = await response.json();

                if (data.status_message === 'Found route between points') {
                    displayRoute(data, startLat, startLng, endLat, endLng);
                } else {
                    showError('No route found. Please try different locations.');
                }
            } catch (error) {
                showError('Route calculation failed: ' + error.message);
            } finally {
                btnRoute.disabled = false;
                btnRoute.textContent = '🗺️ Get Route';
            }
        }

        function displayRoute(data, startLat, startLng, endLat, endLng) {
            // Clear existing route
            if (routeLayer) map.removeLayer(routeLayer);
            if (startMarker) map.removeLayer(startMarker);
            if (endMarker) map.removeLayer(endMarker);

            // Decode route geometry
            const coordinates = decodePolyline(data.route_geometry);

            // Draw route on map
            routeLayer = L.polyline(coordinates, {
                color: '#10b981',
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            // Add markers
            startMarker = L.marker([startLat, startLng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">A</div>',
                    iconSize: [32, 32]
                })
            }).addTo(map);

            endMarker = L.marker([endLat, endLng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">B</div>',
                    iconSize: [32, 32]
                })
            }).addTo(map);

            // Fit map to route
            map.fitBounds(routeLayer.getBounds().pad(0.1));

            // Display summary
            const totalTime = Math.round(data.route_summary.total_time / 60);
            const totalDistance = (data.route_summary.total_distance / 1000).toFixed(2);

            summaryContentEl.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-green-50 rounded-xl text-center">
            <div class="text-3xl mb-2">⏱️</div>
            <div class="text-2xl font-bold text-green-900">${totalTime} min</div>
            <div class="text-sm text-green-700">Estimated Time</div>
          </div>
          <div class="p-4 bg-blue-50 rounded-xl text-center">
            <div class="text-3xl mb-2">📏</div>
            <div class="text-2xl font-bold text-blue-900">${totalDistance} km</div>
            <div class="text-sm text-blue-700">Total Distance</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-xl text-center">
            <div class="text-3xl mb-2">${getRouteIcon(routeTypeEl.value)}</div>
            <div class="text-2xl font-bold text-purple-900">${getRouteLabel(routeTypeEl.value)}</div>
            <div class="text-sm text-purple-700">Route Type</div>
          </div>
        </div>
      `;
            routeSummaryEl.classList.remove('hidden');

            // Display directions
            if (data.route_instructions && data.route_instructions.length > 0) {
                let directionsHTML = '<div class="space-y-2">';
                data.route_instructions.forEach((instruction, index) => {
                    const distance = (instruction[2] / 1000).toFixed(2);
                    const time = Math.round(instruction[3] / 60);
                    directionsHTML += `
            <div class="route-step p-4 border-2 border-gray-200 rounded-xl">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ${index + 1}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">${instruction[9] || 'Continue'}</p>
                  <div class="flex gap-4 text-sm text-gray-600">
                    <span>📏 ${distance} km</span>
                    <span>⏱️ ${time} min</span>
                  </div>
                </div>
              </div>
            </div>
          `;
                });
                directionsHTML += '</div>';
                directionsContentEl.innerHTML = directionsHTML;
                directionsPanelEl.classList.remove('hidden');
            }
        }

        function decodePolyline(encoded) {
            const coordinates = [];
            let index = 0, lat = 0, lng = 0;

            while (index < encoded.length) {
                let b, shift = 0, result = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lat += dlat;

                shift = 0;
                result = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lng += dlng;

                coordinates.push([lat / 1e5, lng / 1e5]);
            }
            return coordinates;
        }

        function getRouteIcon(type) {
            const icons = { drive: '🚗', walk: '🚶', cycle: '🚴', pt: '🚌' };
            return icons[type] || '🚗';
        }

        function getRouteLabel(type) {
            const labels = { drive: 'Driving', walk: 'Walking', cycle: 'Cycling', pt: 'Public Transport' };
            return labels[type] || 'Driving';
        }

        function showError(message) {
            errorMsgEl.textContent = message;
            errorMsgEl.classList.remove('hidden');
        }

        // Event listeners
        btnRoute.addEventListener('click', getRoute);

        btnSwap.addEventListener('click', () => {
            const tempLat = startLatEl.value;
            const tempLng = startLngEl.value;
            startLatEl.value = endLatEl.value;
            startLngEl.value = endLngEl.value;
            endLatEl.value = tempLat;
            endLngEl.value = tempLng;
        });

        btnClear.addEventListener('click', () => {
            startLatEl.value = '';
            startLngEl.value = '';
            endLatEl.value = '';
            endLngEl.value = '';
            routeTypeEl.value = 'drive';
            errorMsgEl.classList.add('hidden');
            routeSummaryEl.classList.add('hidden');
            directionsPanelEl.classList.add('hidden');
            if (routeLayer) map.removeLayer(routeLayer);
            if (startMarker) map.removeLayer(startMarker);
            if (endMarker) map.removeLayer(endMarker);
            map.setView([1.3521, 103.8198], 12);
        });
