import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents, CircleMarker, GeoJSON } from 'react-leaflet';
import { OneMapSearchResult, MapStyle, LatLng, ThemeItem, PlanningAreaFeature } from '../types';
import L from 'leaflet';

// Icons
const iconDefault = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconStart = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  activeLocation: OneMapSearchResult | null;
  mapStyle: MapStyle;
  // Routing
  startPoint: LatLng | null;
  endPoint: LatLng | null;
  routeGeometry: [number, number][] | null;
  onMapClick: (lat: number, lng: number) => void;
  // Themes & Layers
  themeItems: ThemeItem[];
  planningAreas: PlanningAreaFeature[];
  showPlanningAreas: boolean;
  clickedAddress: string | null;
}

const MapController: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const ClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center, zoom, activeLocation, mapStyle,
  startPoint, endPoint, routeGeometry, onMapClick,
  themeItems, clickedAddress, planningAreas, showPlanningAreas
}) => {
  const getTileUrl = (style: MapStyle) => `https://www.onemap.gov.sg/maps/tiles/${style}/{z}/{x}/{y}.png`;

  return (
    <MapContainer
      center={center} zoom={zoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a> &copy; SLA'
        url={getTileUrl(mapStyle)}
        maxZoom={19} minZoom={11}
        detectRetina={true}
        crossOrigin="anonymous"
      />

      <MapController center={center} zoom={zoom} />
      <ClickHandler onMapClick={onMapClick} />

      {activeLocation && (
        <Marker position={[parseFloat(activeLocation.LATITUDE), parseFloat(activeLocation.LONGITUDE)]} icon={iconDefault}>
          <Popup>
            <div className="font-bold">{activeLocation.SEARCHVAL}</div>
            <div className="text-xs">{activeLocation.ADDRESS}</div>
          </Popup>
        </Marker>
      )}

      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={iconStart}>
          <Popup>Start Point</Popup>
        </Marker>
      )}
      {endPoint && (
        <Marker position={[endPoint.lat, endPoint.lng]} icon={iconDefault}>
          <Popup>
            <div>End Point</div>
            {clickedAddress && <div className="text-xs mt-1 border-t pt-1">{clickedAddress}</div>}
          </Popup>
        </Marker>
      )}

      {routeGeometry && (
        <Polyline positions={routeGeometry} color="blue" weight={5} opacity={0.7} />
      )}

      {showPlanningAreas && planningAreas.length > 0 && (
        <GeoJSON
          data={planningAreas as any}
          style={() => ({
            color: '#4a0404',
            weight: 2,
            opacity: 0.8,
            fillColor: '#d60000',
            fillOpacity: 0.1
          })}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.pln_area_n) {
              layer.bindPopup(
                `<div class="text-center font-bold text-red-700">${feature.properties.pln_area_n}</div>
                   <div class="text-xs text-gray-500">URA Planning Area</div>`
              );
            }
          }}
        />
      )}

      {themeItems.map((item, idx) => {
        const parts = item.LatLng.split(',');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <CircleMarker
            key={idx} center={[lat, lng]} radius={6}
            pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.5 }}
          >
            <Popup>
              <strong className="text-sm">{item.NAME}</strong>
              <p className="text-xs m-0">{item.ADDRESSSTREETNAME}</p>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;