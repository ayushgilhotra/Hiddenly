/**
 * js/maps.js
 * This file contains shared logic for Google Maps, including the dark theme
 * and reusable functions for creating markers and initializing maps.
 */

// Dark mode map styles matching the site's dark navy/gold theme
const DARK_MAP_STYLE = [
    { "elementType": "geometry", "stylers": [{ "color": "#13110e" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#13110e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#d4a853" }] },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d4a853" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d4a853" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#1a1a1a" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b6b6b" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#13110e" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#13110e" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#b1b1b1" }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#2f3948" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d4a853" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#0e1621" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#13110e" }]
    }
];

/**
 * Initializes a basic dark themed Google Map
 * @param {string} containerId - The ID of the HTML element to hold the map
 * @param {object} options - Initial map options (center, zoom, etc.)
 */
function initDarkMap(containerId, options = {}) {
    const defaultOptions = {
        center: { lat: 20.5937, lng: 78.9629 }, // Default Center: India
        zoom: 5,
        styles: DARK_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    };

    const container = document.getElementById(containerId);
    if (!container) return null;

    return new google.maps.Map(container, { ...defaultOptions, ...options });
}

/**
 * Creates a custom gold circle marker for a spot
 * @param {google.maps.Map} map - The map instance
 * @param {object} position - {lat, lng} coordinates
 * @param {string} title - Marker tooltip title
 */
function createSpotMarker(map, position, title) {
    return new google.maps.Marker({
        position,
        map,
        title,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#d4a853', // Gold color to match site
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
        }
    });
}

/**
 * Creates an InfoWindow with consistent styling
 * @param {object} spot - The spot data object
 */
function createSpotInfoWindow(spot) {
    const content = `
        <div style="background: #13110e; padding: 10px; color: #fff; border-radius: 8px; border: 1px solid #d4a853;">
            <h4 style="color: #d4a853; margin: 0 0 5px 0; font-family: 'DM Sans', sans-serif;">${spot.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #ccc;"><i class="fas fa-map-marker-alt"></i> ${spot.location}</p>
            <p style="margin: 0 0 10px 0; font-size: 0.8rem; font-weight: bold; color: #d4a853;">Budget: ${spot.budgetRange}</p>
            <a href="spot?id=${spot.id}" style="color: #d4a853; text-decoration: none; font-size: 0.85rem; font-weight: bold; border-bottom: 1px solid #d4a853;">View Details</a>
        </div>
    `;

    return new google.maps.InfoWindow({ content });
}

/**
 * Gets the current distance between two points in km
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
}

/**
 * Helper to get user's current position using browser API
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    });
}

/**
 * Shows a distinct marker for the user's location
 */
function showUserMarker(map, position) {
    return new google.maps.Marker({
        position,
        map,
        zIndex: 999,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#4285F4', // Google Blue
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
        },
        title: "Your Location"
    });
}
