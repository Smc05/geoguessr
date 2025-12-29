/**
 * map.js
 * Handles Google Maps integration, Street View, and map interactions
 */

// Global variables for maps and markers
let map = null;
let streetView = null;
let resultMap = null;
let guessMarker = null;
let currentPanorama = null;
let currentHeading = 0;

// Google Maps API Key - Replace with your own key
// ⚠️ SECURITY WARNING: This API key is exposed in client-side code.
// For production use, implement a backend proxy to protect your API key.
// Always use API key restrictions (HTTP referrers) in Google Cloud Console.
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

// Scoring constants
const SCORE_PERFECT = 5000;
const SCORE_VERY_CLOSE_BASE = 5000;
const SCORE_CLOSE_BASE = 4000;
const SCORE_MEDIUM_BASE = 3000;
const SCORE_FAR_BASE = 1000;

const DISTANCE_PERFECT = 1000;        // < 1km
const DISTANCE_VERY_CLOSE = 10000;    // < 10km
const DISTANCE_CLOSE = 100000;        // < 100km
const DISTANCE_MEDIUM = 1000000;      // < 1000km
const DISTANCE_FAR = 5000000;         // < 5000km

// Scoring divisors for calculating point deductions
const DIVISOR_VERY_CLOSE = 10;
const DIVISOR_CLOSE = 100;
const DIVISOR_MEDIUM = 500;
const DIVISOR_FAR = 5000;

/**
 * Dynamically loads Google Maps API
 */
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        // Check if API key is set
        if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('Google Maps API key not set. Please add your API key to js/map.js');
            reject(new Error('API key not configured'));
            return;
        }

        // Check if already loaded
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));
        
        document.head.appendChild(script);
    });
}

/**
 * Initializes the guess map
 */
function initializeGuessMap() {
    if (!window.google || !window.google.maps) {
        console.error('Google Maps not loaded');
        return;
    }

    const mapElement = document.getElementById('guess-map');
    
    map = new google.maps.Map(mapElement, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Add click listener for placing guess marker
    map.addListener('click', (event) => {
        placeGuessMarker(event.latLng);
    });
}

/**
 * Places or updates the guess marker on the map
 */
function placeGuessMarker(latLng) {
    if (guessMarker) {
        guessMarker.setPosition(latLng);
    } else {
        guessMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'Your Guess',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
                        <path fill="#667eea" stroke="#fff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 13 16 32 16 32s16-19 16-32c0-8.8-7.2-16-16-16z"/>
                        <circle cx="16" cy="16" r="6" fill="#fff"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 48),
                anchor: new google.maps.Point(16, 48)
            },
            animation: google.maps.Animation.DROP
        });
    }

    // Enable the make guess button
    const makeGuessBtn = document.getElementById('make-guess-btn');
    if (makeGuessBtn) {
        makeGuessBtn.disabled = false;
    }
}

/**
 * Gets the current guess position
 */
function getGuessPosition() {
    if (guessMarker) {
        const position = guessMarker.getPosition();
        return { lat: position.lat(), lng: position.lng() };
    }
    return null;
}

/**
 * Clears the guess marker
 */
function clearGuessMarker() {
    if (guessMarker) {
        guessMarker.setMap(null);
        guessMarker = null;
    }

    const makeGuessBtn = document.getElementById('make-guess-btn');
    if (makeGuessBtn) {
        makeGuessBtn.disabled = true;
    }
}

/**
 * Initializes Street View for a location
 */
function initializeStreetView(location) {
    return new Promise((resolve, reject) => {
        if (!window.google || !window.google.maps) {
            reject(new Error('Google Maps not loaded'));
            return;
        }

        const streetViewElement = document.getElementById('street-view');
        const position = { lat: location.lat, lng: location.lng };

        // Check if Street View is available at this location
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama(
            { location: position, radius: 100 },
            (data, status) => {
                if (status === 'OK') {
                    // Create Street View panorama
                    currentPanorama = new google.maps.StreetViewPanorama(
                        streetViewElement,
                        {
                            position: data.location.latLng,
                            pov: { heading: 0, pitch: 0 },
                            zoom: 0,
                            addressControl: false,
                            fullscreenControl: false,
                            motionTracking: false,
                            motionTrackingControl: false,
                            showRoadLabels: false,
                            zoomControl: true,
                            panControl: true,
                            enableCloseButton: false,
                            linksControl: true
                        }
                    );

                    // Update compass when view changes
                    currentPanorama.addListener('pov_changed', () => {
                        const pov = currentPanorama.getPov();
                        updateCompass(pov.heading);
                    });

                    resolve(currentPanorama);
                } else {
                    reject(new Error('Street View not available at this location'));
                }
            }
        );
    });
}

/**
 * Updates the compass based on Street View heading
 */
function updateCompass(heading) {
    currentHeading = heading;
    const compassArrow = document.getElementById('compass-arrow');
    if (compassArrow) {
        compassArrow.style.transform = `translate(-50%, -70%) rotate(${heading}deg)`;
    }
}

/**
 * Initializes the result map showing both locations
 */
function initializeResultMap(actualLocation, guessLocation) {
    const resultMapElement = document.getElementById('result-map');
    
    resultMap = new google.maps.Map(resultMapElement, {
        center: actualLocation,
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // Add marker for actual location
    new google.maps.Marker({
        position: actualLocation,
        map: resultMap,
        title: 'Actual Location',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
                    <path fill="#27ae60" stroke="#fff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 13 16 32 16 32s16-19 16-32c0-8.8-7.2-16-16-16z"/>
                    <circle cx="16" cy="16" r="6" fill="#fff"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(32, 48),
            anchor: new google.maps.Point(16, 48)
        }
    });

    // Add marker for guess location
    new google.maps.Marker({
        position: guessLocation,
        map: resultMap,
        title: 'Your Guess',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
                    <path fill="#e74c3c" stroke="#fff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 13 16 32 16 32s16-19 16-32c0-8.8-7.2-16-16-16z"/>
                    <circle cx="16" cy="16" r="6" fill="#fff"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(32, 48),
            anchor: new google.maps.Point(16, 48)
        }
    });

    // Draw line between locations
    new google.maps.Polyline({
        path: [actualLocation, guessLocation],
        geodesic: true,
        strokeColor: '#667eea',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: resultMap
    });

    // Fit map bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(actualLocation);
    bounds.extend(guessLocation);
    resultMap.fitBounds(bounds);
}

/**
 * Calculates distance between two points using Haversine formula
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    if (window.google && window.google.maps && google.maps.geometry) {
        // Use Google Maps geometry library if available
        const point1 = new google.maps.LatLng(lat1, lng1);
        const point2 = new google.maps.LatLng(lat2, lng2);
        return google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    } else {
        // Fallback to Haversine formula
        const R = 6371000; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}

/**
 * Formats distance for display
 */
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    } else if (meters < 10000) {
        return `${(meters / 1000).toFixed(2)} km`;
    } else {
        return `${Math.round(meters / 1000)} km`;
    }
}

/**
 * Calculates score based on distance
 */
function calculateScore(distance) {
    // Scoring algorithm using constants:
    // Perfect (< 1km): 5000 points
    // Very close (< 10km): 4000+ points
    // Close (< 100km): 3000+ points
    // Medium (< 1000km): 1000+ points
    // Far (< 5000km): 100+ points
    // Very far (>= 5000km): 0 points

    if (distance < DISTANCE_PERFECT) {
        return SCORE_PERFECT;
    } else if (distance < DISTANCE_VERY_CLOSE) {
        return Math.round(SCORE_VERY_CLOSE_BASE - (distance / DIVISOR_VERY_CLOSE));
    } else if (distance < DISTANCE_CLOSE) {
        return Math.round(SCORE_CLOSE_BASE - (distance / DIVISOR_CLOSE));
    } else if (distance < DISTANCE_MEDIUM) {
        return Math.round(SCORE_MEDIUM_BASE - (distance / DIVISOR_MEDIUM));
    } else if (distance < DISTANCE_FAR) {
        return Math.round(SCORE_FAR_BASE - (distance / DIVISOR_FAR));
    } else {
        return 0;
    }
}
