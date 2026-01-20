export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapSearchResult[];
}

export interface AuthResponse {
  access_token: string;
  expiry_timestamp: string;
}

export enum MapStyle {
  DEFAULT = 'Default',
  GREY = 'Grey',
  NIGHT = 'Night',
  ORIGINAL = 'Original',
  LANDLOT = 'LandLot'
}

export interface LatLng {
  lat: number;
  lng: number;
}

// Routing Types
export interface RouteInstruction {
  instruction: string;
  distance: number;
  time: number;
}

export interface RouteResponse {
  route_geometry: string; // Encoded polyline string
  status: number;
  status_message: string;
  route_instructions?: any[];
  route_summary?: {
    total_time: number;
    total_distance: number;
  };
}

// Reverse Geocode Types
export interface RevGeoResponse {
  GeocodeInfo: [{
    BUILDINGNAME: string;
    BLOCK: string;
    ROAD: string;
    POSTALCODE: string;
    XCOORD: string;
    YCOORD: string;
    LATITUDE: string;
    LONGITUDE: string;
  }]
}

// Theme Types
export interface ThemeItem {
  NAME: string;
  DESCRIPTION: string;
  ADDRESSSTREETNAME: string;
  LatLng: string; // Format "lat,lng"
  ICON_NAME?: string;
}

export interface ThemeResponse {
  SrchResults: ThemeItem[];
}

// Planning Area Types (GeoJSON)
export interface PlanningAreaFeature {
  type: "Feature";
  properties: {
    pln_area_n: string; // Name, e.g., "BEDOK"
    pln_area_c: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][]; // GeoJSON coordinates
  };
}

export interface PlanningAreaResponse {
  type: "FeatureCollection";
  features: PlanningAreaFeature[];
}

// Converter Types
export interface ConverterResponse {
  X?: string;
  Y?: string;
  latitude?: string;
  longitude?: string;
}