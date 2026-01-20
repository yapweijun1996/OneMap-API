import { OneMapSearchResponse, AuthResponse, RouteResponse, RevGeoResponse, ThemeResponse, LatLng, OneMapSearchResult, PlanningAreaResponse, ConverterResponse } from '../types';

const BASE_API_URL = 'https://www.onemap.gov.sg/api';

/**
 * Helper to decode Google Polyline Algorithm string into LatLng array.
 * OneMap uses this format for route geometry.
 */
function decodePolyline(encoded: string): [number, number][] {
  const poly = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5] as [number, number]);
  }
  return poly;
}

export const OneMapService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_API_URL}/auth/post/getToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Authentication failed.');
    return response.json();
  },

  search: async (query: string, token: string): Promise<OneMapSearchResponse> => {
    // Check if query looks like coordinates (e.g. "1.3521, 103.8198")
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = query.trim().match(coordRegex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[3]);

      // Use Reverse Geocode for coordinates
      const url = `${BASE_API_URL}/public/revgeocode?location=${lat},${lng}&buffer=50&addressType=All`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Reverse Geocode failed for coordinates.');
      const data: RevGeoResponse = await response.json();
      
      // Map RevGeoResponse to OneMapSearchResult format
      const rawResults = data.GeocodeInfo || [];
      const results: OneMapSearchResult[] = rawResults.map((item: any) => {
        const building = item.BUILDINGNAME === 'NIL' ? '' : item.BUILDINGNAME;
        const road = item.ROAD === 'NIL' ? '' : item.ROAD;
        const blk = item.BLOCK === 'NIL' ? '' : item.BLOCK;
        const postal = item.POSTALCODE === 'NIL' ? '' : item.POSTALCODE;
        
        const address = [blk, road, postal].filter(p => p).join(' ');

        return {
          SEARCHVAL: building || road || "Coordinate Location",
          BLK_NO: blk,
          ROAD_NAME: road,
          BUILDING: building,
          ADDRESS: address,
          POSTAL: postal,
          X: item.XCOORD,
          Y: item.YCOORD,
          LATITUDE: item.LATITUDE,
          LONGITUDE: item.LONGITUDE
        };
      });

      return {
        found: results.length,
        totalNumPages: 1,
        pageNum: 1,
        results
      };
    }

    // Default: Elastic Text Search
    const url = `${BASE_API_URL}/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Search failed.');
    return response.json();
  },

  reverseGeocode: async (lat: number, lng: number, token: string): Promise<RevGeoResponse> => {
    const url = `${BASE_API_URL}/public/revgeocode?location=${lat},${lng}&buffer=50&addressType=All`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Reverse Geocode failed');
    return response.json();
  },

  getRoute: async (start: LatLng, end: LatLng, routeType: 'drive' | 'walk' | 'cycle', token: string): Promise<{ geometry: [number, number][], summary: any } | null> => {
    const startStr = `${start.lat},${start.lng}`;
    const endStr = `${end.lat},${end.lng}`;
    const url = `${BASE_API_URL}/public/routingsvc/route?start=${startStr}&end=${endStr}&routeType=${routeType}`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return null;
    const data: RouteResponse = await response.json();
    
    if (data.route_geometry) {
      return {
        geometry: decodePolyline(data.route_geometry),
        summary: data.route_summary
      };
    }
    return null;
  },

  getTheme: async (themeName: string, token: string): Promise<ThemeResponse> => {
    const url = `${BASE_API_URL}/public/themesvc/retrieveTheme?queryName=${themeName}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Theme fetch failed');
    return response.json();
  },

  getPlanningAreas: async (token: string): Promise<PlanningAreaResponse> => {
    // 2024 Planning Areas
    const url = `${BASE_API_URL}/public/planningarea?year=2024`; 
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Planning Area fetch failed');
    return response.json();
  },

  convertCoordinates: async (lat: number, lng: number, token: string): Promise<ConverterResponse> => {
    const url = `${BASE_API_URL}/common/convert/4326to3414?latitude=${lat}&longitude=${lng}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Conversion failed');
    return response.json();
  }
};