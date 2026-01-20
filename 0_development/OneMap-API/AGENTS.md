# Roles

- You are Tech Lead

# Rules

- Reply me mandarin.
- Generate mermaid diagram to explain logic.
- Do investigation to understand project goal.
- Make sure each files no more than 300 lines.
- Make sure code easy to understand and cheap to maintain.
- Do code refactor if needed.
- Ask me question if needed but before you ask me please do the investigation first.
- Reply end with option for next step, eg: A....B....C...


# Project Goal

- make the OneMap API easy to use and maintain.

# Account OneMap

email: yapweijun1996@gmail.com
pass: 2Xrc9sTqtL!U@bV

# Others Information
OneMap is the authoritative national map of Singapore, developed by the Singapore Land Authority (SLA). Its API is robust, open (mostly free), and granular, making it the standard choice for Singapore-based location services over Google Maps due to its specialized local data (e.g., block numbers, void decks, and sheltered walkways).

Here is a breakdown of the OneMap API features for your review, categorized by function.

1. Core Mapping Services
These services allow you to render the map itself within your application.

Basemaps: Provides high-resolution map tiles in various styles:

Default/Original: Full-color standard maps.

Grey: Muted tones, ideal for overlaying data visualization so the map doesn't distract.

Night: Dark mode optimized.

LandLot: Shows land lot information (useful for property/real estate contexts).

Static Maps: Generates a static PNG image of a map with optional overlays (pins, lines, polygons). Useful for receipts, emails, or reports where an interactive map isn't needed.

Minimap / Advanced Minimap: A widget generator that creates small, embeddable interactive maps (e.g., for a "Contact Us" page) without heavy coding.

2. Location Search & Geocoding
Note: As of recent updates, the Search API now requires token-based authentication.

Search (Geocoding): Converts text (postal codes, building names, road names) into coordinates.

Strength: Highly accurate for Singaporean formats (e.g., "HDB", "Void Deck", specific block numbers) that international maps often miss.

Reverse Geocoding: Converts coordinates (Latitude/Longitude) back into a readable address or road name.

3. Routing & Navigation
OneMap provides localized routing engines that account for Singapore's specific infrastructure.

Modes:

Public Transport: Includes bus and MRT/LRT routes, transfers, and timings.

Drive: Standard vehicular routing.

Walk: Includes sheltered walkways and overhead bridges.

Cycle: Routing via Park Connector Networks (PCN) and cycling paths.

Nearby Transport: Returns a list of the nearest Bus Stops and MRT/LRT stations within a specified radius (up to 5km) of a given point.

4. Data Analytics & Thematic Layers
This is where OneMap excels over competitors, offering rich government data overlays.

Themes (Thematic Layers): Access over 100+ layers of location data, including:

Amenities: Hawker centers, supermarkets, ATMs.

Education: Kindergartens, schools (and their catchment areas).

Health: Clinics, hospitals.

Environment: Parks, green spaces.

Population Query: Provides demographic data (from the Department of Statistics) for specific areas, such as:

Economic status, household income, and education levels.

Age and gender distribution.

Planning Areas: Retrieves URA (Urban Redevelopment Authority) planning area polygons. This is essential for developers building property analytics or urban planning tools to group data by official districts (e.g., "Bedok", "Queenstown").

5. Utilities
Coordinate Converters: Singapore uses a specific coordinate system called SVY21. This API converts between:

WGS84 (Standard GPS Lat/Long used by Google/Global apps).

SVY21 (Singapore localized grid).

EPSG:3857 (Web Mercator used for map tiles).

6. Authentication & Usage
Token Authentication: Most APIs (especially Search) now require you to generate a JWT (JSON Web Token) via a POST request.

Token Validity: Tokens generally last for 3 days before needing a refresh.

Cost: The API is generally free for commercial and non-commercial use, provided you attribute OneMap, though high-volume users may be subject to rate limits or distinct terms.

Feature Category,Key Capability,Best For...
Visuals,"Basemaps (Night, Grey, LandLot)","Real estate apps, Dashboards."
Search,Precise Address/Postal Lookup,"Logistics, Delivery, Registration forms."
Routing,"Walk (Sheltered), Cycle (PCN)","Fitness apps, Last-mile delivery."
Data,Population & Thematic Layers,"Market research, Property valuation."
Tech,SVY21 ↔ WGS84 Converter,"Government projects, Land surveying."