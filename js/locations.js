/**
 * locations.js
 * Manages the pool of game locations and random selection
 */

// Curated list of interesting locations around the world
// Each location includes coordinates and a description
const LOCATION_POOL = [
    // Europe
    { lat: 48.858844, lng: 2.294351, name: "Paris, France" },
    { lat: 41.890251, lng: 12.492373, name: "Rome, Italy" },
    { lat: 51.501476, lng: -0.140634, name: "London, UK" },
    { lat: 52.520008, lng: 13.404954, name: "Berlin, Germany" },
    { lat: 41.403706, lng: 2.174347, name: "Barcelona, Spain" },
    { lat: 59.329444, lng: 18.068611, name: "Stockholm, Sweden" },
    { lat: 50.075538, lng: 14.437800, name: "Prague, Czech Republic" },
    { lat: 47.497913, lng: 19.040236, name: "Budapest, Hungary" },
    { lat: 55.755825, lng: 37.617298, name: "Moscow, Russia" },
    { lat: 64.146582, lng: -21.942536, name: "Reykjavik, Iceland" },
    
    // Asia
    { lat: 35.689487, lng: 139.691711, name: "Tokyo, Japan" },
    { lat: 39.904202, lng: 116.407394, name: "Beijing, China" },
    { lat: 31.230391, lng: 121.473701, name: "Shanghai, China" },
    { lat: 22.396427, lng: 114.109497, name: "Hong Kong" },
    { lat: 1.352083, lng: 103.819836, name: "Singapore" },
    { lat: 13.756331, lng: 100.501762, name: "Bangkok, Thailand" },
    { lat: 35.652832, lng: 139.839478, name: "Tokyo Tower, Japan" },
    { lat: 28.613939, lng: 77.209023, name: "New Delhi, India" },
    { lat: 19.076090, lng: 72.877426, name: "Mumbai, India" },
    { lat: 37.566536, lng: 126.977966, name: "Seoul, South Korea" },
    
    // North America
    { lat: 40.748817, lng: -73.985428, name: "New York City, USA" },
    { lat: 37.774929, lng: -122.419418, name: "San Francisco, USA" },
    { lat: 34.052235, lng: -118.243683, name: "Los Angeles, USA" },
    { lat: 41.878113, lng: -87.629799, name: "Chicago, USA" },
    { lat: 36.114647, lng: -115.172813, name: "Las Vegas, USA" },
    { lat: 43.651070, lng: -79.347015, name: "Toronto, Canada" },
    { lat: 49.282730, lng: -123.120735, name: "Vancouver, Canada" },
    { lat: 19.432608, lng: -99.133209, name: "Mexico City, Mexico" },
    { lat: 25.761681, lng: -80.191788, name: "Miami, USA" },
    { lat: 47.606209, lng: -122.332069, name: "Seattle, USA" },
    
    // South America
    { lat: -23.550520, lng: -46.633308, name: "São Paulo, Brazil" },
    { lat: -22.906847, lng: -43.172897, name: "Rio de Janeiro, Brazil" },
    { lat: -34.603722, lng: -58.381592, name: "Buenos Aires, Argentina" },
    { lat: -33.448891, lng: -70.669266, name: "Santiago, Chile" },
    { lat: -12.046374, lng: -77.042793, name: "Lima, Peru" },
    { lat: 4.710989, lng: -74.072092, name: "Bogotá, Colombia" },
    
    // Africa
    { lat: -33.924870, lng: 18.424055, name: "Cape Town, South Africa" },
    { lat: -26.204103, lng: 28.047305, name: "Johannesburg, South Africa" },
    { lat: 30.044420, lng: 31.235712, name: "Cairo, Egypt" },
    { lat: -1.286389, lng: 36.817223, name: "Nairobi, Kenya" },
    { lat: -4.038333, lng: 39.668333, name: "Mombasa, Kenya" },
    { lat: 33.589886, lng: -7.603869, name: "Casablanca, Morocco" },
    
    // Oceania
    { lat: -33.868820, lng: 151.209296, name: "Sydney, Australia" },
    { lat: -37.813629, lng: 144.963058, name: "Melbourne, Australia" },
    { lat: -27.469771, lng: 153.025124, name: "Brisbane, Australia" },
    { lat: -41.286461, lng: 174.776230, name: "Wellington, New Zealand" },
    { lat: -36.848461, lng: 174.763336, name: "Auckland, New Zealand" },
    
    // Middle East
    { lat: 25.276987, lng: 55.296249, name: "Dubai, UAE" },
    { lat: 31.963158, lng: 35.930359, name: "Amman, Jordan" },
    { lat: 33.888630, lng: 35.495480, name: "Beirut, Lebanon" },
    { lat: 41.716667, lng: 44.783333, name: "Tbilisi, Georgia" },
    
    // Additional interesting locations
    { lat: 27.175015, lng: 78.042155, name: "Taj Mahal, India" },
    { lat: 40.689247, lng: -74.044502, name: "Statue of Liberty, USA" },
    { lat: 43.722866, lng: 10.396597, name: "Pisa, Italy" },
    { lat: 37.971599, lng: 23.726166, name: "Athens, Greece" },
    { lat: -13.163068, lng: -72.544963, name: "Machu Picchu, Peru" },
    { lat: 29.979235, lng: 31.134202, name: "Pyramids of Giza, Egypt" },
    { lat: 48.859955, lng: 2.326622, name: "Arc de Triomphe, Paris" },
    { lat: 51.178882, lng: -1.826215, name: "Stonehenge, UK" },
    { lat: 40.431908, lng: 116.570374, name: "Great Wall of China" },
    { lat: -25.344490, lng: 131.036755, name: "Uluru, Australia" }
];

/**
 * Shuffles array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Selects random locations for a game
 * @param {number} count - Number of locations to select
 * @returns {Array} Array of random locations
 */
function getRandomLocations(count = 5) {
    const shuffled = shuffleArray(LOCATION_POOL);
    return shuffled.slice(0, count);
}

/**
 * Validates if a location has Street View coverage
 * This is a placeholder - actual validation would require Google Street View API
 * @param {Object} location - Location object with lat/lng
 * @returns {boolean} Whether the location has Street View
 */
function hasStreetViewCoverage(location) {
    // In a real implementation, you would use:
    // const streetViewService = new google.maps.StreetViewService();
    // streetViewService.getPanorama({location: {lat, lng}, radius: 50}, callback);
    return true; // For now, assume all curated locations have coverage
}
