// This file contains logic for showing spots on the UI (cards, lists, etc.)

// --- FUNCTION: Create the HTML for a single spot card ---
function createSpotCard(spot) {
    // Helper to get a stable fallback based on category
    const fallbacks = {
        'CAFE': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
        'NATURE': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
        'FOOD': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'ADVENTURE': 'https://images.unsplash.com/photo-1533240332313-0bc499f50e10',
        'OTHER': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    };
    const defaultImg = fallbacks[spot.category] || fallbacks['OTHER'];

    // We use a template string (backticks) to build the HTML
    // Note: We use 'spot?id=' instead of 'spot.html?id=' to avoid server redirect issues
    return `
        <div class="card spot-card" id="spot-card-${spot.id}" data-id="${spot.id}" onclick="handleCardClick(${spot.id}, ${spot.latitude}, ${spot.longitude})">
            <img src="${spot.imageUrl}" alt="${spot.name}" class="card-img" onerror="if(!this.dataset.tried) { this.dataset.tried=true; this.src='${defaultImg}'; }">
            <div class="card-content">
                <span class="badge badge-category">${spot.category}</span>
                <h3 class="mt-20">${spot.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${spot.location}</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="badge badge-budget">${spot.budgetRange}</span>
                    <span class="badge" style="background: rgba(212, 168, 83, 0.1); color: var(--primary); border: 1px solid rgba(212, 168, 83, 0.2);"><i class="fas fa-users"></i> ${spot.personsCount || 0}</span>
                    ${spot.distance ? `<span class="badge" style="background: rgba(255,255,255,0.1); color: #fff;"><i class="fas fa-location-arrow"></i> ${spot.distance} km away</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- FUNCTION: Render a list of spots into a container ---
function renderSpots(spots, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (spots.length === 0) {
        container.innerHTML = '<p class="text-center">No hidden spots found yet. Be the first to add one!</p>';
        return;
    }

    // Build the grid of cards
    container.innerHTML = spots.map(spot => createSpotCard(spot)).join('');
}

// --- FUNCTION: Load and show latest 6 spots (for Home Page) ---
async function loadHomeSpots() {
    try {
        const spots = await api.getSpots();
        // Just take the latest 6 spots
        const latestSpots = spots.slice(-6).reverse();
        renderSpots(latestSpots, 'home-spots-grid');
    } catch (error) {
        console.error('Failed to load home spots:', error);
    }
}

// --- GLOBALS FOR EXPLORE PAGE ---
let exploreMap;
let activeMarkers = [];
let activeInfoWindow = null;

/**
 * Loads and filters spots, then renders cards AND map markers
 */
async function loadExploreSpots() {
    try {
        const category = getUrlParam('category') || 'ALL';
        let spots;

        if (category === 'ALL') {
            spots = await api.getSpots();
        } else {
            spots = await api.getSpotsByCategory(category);
        }

        // 1. Render Cards
        renderSpots(spots, 'explore-spots-grid');

        // 2. Initialize or Update Map
        if (!exploreMap && document.getElementById('explore-map')) {
            exploreMap = initDarkMap('explore-map', { zoom: 5 });

            // Add "Locate Me" button to the map
            addLocateMeButton(exploreMap);
        }

        if (exploreMap) {
            renderMapMarkers(spots);
        }

        // Update Title
        const title = document.getElementById('explore-title');
        if (title) title.innerText = category === 'ALL' ? 'Explore all Hidden Gems' : `Hidden ${category} Gems`;

    } catch (error) {
        console.error('Failed to load explore spots:', error);
    }
}

/**
 * Renders markers on the explore map
 */
function renderMapMarkers(spots) {
    // Clear old markers
    activeMarkers.forEach(m => m.setMap(null));
    activeMarkers = [];

    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;

    spots.forEach(spot => {
        if (spot.latitude && spot.longitude) {
            const pos = { lat: spot.latitude, lng: spot.longitude };
            const marker = createSpotMarker(exploreMap, pos, spot.name);

            // Interaction: Marker Click
            marker.addListener('click', () => {
                showSpotInfo(spot, marker);
                highlightCard(spot.id);
            });

            activeMarkers.push({ id: spot.id, marker });
            bounds.extend(pos);
            hasCoords = true;
        }
    });

    // Fit map to markers if there are any
    if (hasCoords) {
        exploreMap.fitBounds(bounds);
        if (exploreMap.getZoom() > 15) exploreMap.setZoom(15);
    }
}

/**
 * Highlights a card in the sidebar and scrolls to it
 */
function highlightCard(spotId) {
    // Remove all highlights
    document.querySelectorAll('.spot-card').forEach(c => c.style.borderColor = 'transparent');

    const card = document.getElementById(`spot-card-${spotId}`);
    if (card) {
        card.style.borderColor = 'var(--primary)';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Handles clicking a card: Pans map and opens info window
 */
function handleCardClick(spotId, lat, lng) {
    if (!lat || !lng) {
        navigateTo(`spot?id=${spotId}`);
        return;
    }

    if (exploreMap) {
        const pos = { lat, lng };
        exploreMap.panTo(pos);
        exploreMap.setZoom(15);

        // Find the marker for this spot and trigger click
        const markerObj = activeMarkers.find(m => m.id === spotId);
        if (markerObj) {
            google.maps.event.trigger(markerObj.marker, 'click');
        }
    } else {
        navigateTo(`spot?id=${spotId}`);
    }
}

/**
 * Shows the InfoWindow for a spot
 */
function showSpotInfo(spot, marker) {
    if (activeInfoWindow) activeInfoWindow.close();

    activeInfoWindow = createSpotInfoWindow(spot);
    activeInfoWindow.open(exploreMap, marker);
}

/**
 * Adds a "Locate Me" button to the map
 */
function addLocateMeButton(map) {
    const controlDiv = document.createElement('div');
    controlDiv.style.margin = '10px';

    const controlUI = document.createElement('button');
    controlUI.style.backgroundColor = 'var(--card-bg)';
    controlUI.style.border = '1px solid var(--primary)';
    controlUI.style.color = 'var(--primary)';
    controlUI.style.padding = '8px 12px';
    controlUI.style.borderRadius = '4px';
    controlUI.innerHTML = '📍 My Location';
    controlDiv.appendChild(controlUI);

    controlUI.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Add a unique marker for user location
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        scale: 5,
                        fillColor: '#fff',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: '#000'
                    },
                    title: "You are here"
                });

                map.setCenter(pos);
                map.setZoom(14);
            });
        }
    });

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
}

// --- FUNCTION: Load details for a single spot ---
async function loadSpotDetails() {
    const id = getUrlParam('id');
    console.log('Loading details for spot ID:', id);
    if (!id) {
        console.warn('No spot ID found in URL, navigating back to explore.');
        navigateTo('explore');
        return;
    }

    try {
        const spot = await api.getSpotById(id);

        // Fill the page with spot data
        document.getElementById('spot-name').innerText = spot.name;

        const spotImg = document.getElementById('spot-image');
        spotImg.src = spot.imageUrl;

        // Category-aware fallback for detail page
        const fallbacks = {
            'CAFE': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
            'NATURE': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
            'FOOD': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            'ADVENTURE': 'https://images.unsplash.com/photo-1533240332313-0bc499f50e10',
            'OTHER': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
        };
        const defaultImg = fallbacks[spot.category] || fallbacks['OTHER'];
        spotImg.onerror = () => {
            if (!spotImg.dataset.tried) {
                spotImg.dataset.tried = true;
                spotImg.src = defaultImg;
            }
        };

        document.getElementById('spot-category').innerText = spot.category;
        document.getElementById('spot-location').innerText = spot.location;
        document.getElementById('spot-budget').innerText = spot.budgetRange;

        // Add persons count to details if element exists, or just update text
        const personsEl = document.getElementById('spot-persons');
        if (personsEl) {
            personsEl.innerText = spot.personsCount + " Persons";
        }

        document.getElementById('spot-description').innerText = spot.description;
        document.getElementById('spot-added-by').innerText = spot.addedBy.name;
        document.getElementById('spot-date').innerText = formatDate(spot.createdAt);

        // --- MAP INTEGRATION ---
        const mapSection = document.getElementById('spot-map-section');
        const mapContainer = document.getElementById('detail-map');

        if (spot.latitude && spot.longitude && mapContainer) {
            mapSection.classList.remove('hidden');
            const pos = { lat: spot.latitude, lng: spot.longitude };
            const detailMap = initDarkMap('detail-map', {
                center: pos,
                zoom: 15
            });
            createSpotMarker(detailMap, pos, spot.name);

            // Get Directions Button
            const directionsBtn = document.getElementById('directions-btn');
            if (directionsBtn) {
                directionsBtn.onclick = () => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
                    window.open(url, '_blank');
                };
            }
        } else if (mapSection) {
            mapSection.innerHTML = '<p style="color: var(--text-muted); padding: 20px; text-align: center;">📍 Location not added for this spot</p>';
            mapSection.classList.remove('hidden');
        }

        // Get the current user email from the token (if logged in) safely
        let currentUserEmail = null;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // JWT payload is the second part (index 1)
                const payload = JSON.parse(atob(token.split('.')[1]));
                currentUserEmail = payload.sub || payload.email; // Support both standard 'sub' and custom 'email'
            }
        } catch (e) {
            console.error('Error parsing token:', e);
        }

        // If the logged-in user is the owner, show the Edit/Delete buttons
        // We compare case-insensitively just to be extremely safe
        if (currentUserEmail && spot.addedBy.email &&
            currentUserEmail.toLowerCase() === spot.addedBy.email.toLowerCase()) {

            const ownerControls = document.getElementById('owner-controls');
            if (ownerControls) {
                ownerControls.classList.remove('hidden');
                ownerControls.style.display = 'flex'; // Ensure it's visible if hidden class uses display:none
            }

            const editBtn = document.getElementById('edit-button');
            if (editBtn) {
                editBtn.onclick = () => navigateTo(`edit-spot?id=${spot.id}`);
            }
        }

    } catch (error) {
        console.error('Failed to load spot details:', error);
        showAlert('Could not load spot details', 'error');
    }
}

// --- FUNCTION: Delete a spot ---
async function handleDeleteSpot() {
    const id = getUrlParam('id');
    if (confirm('Are you sure you want to delete this secret spot?')) {
        try {
            await api.deleteSpot(id);
            showAlert('Spot deleted successfully!');
            navigateTo('explore');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }
}

/**
 * Handles the "Explore Near Me" button click on Home page
 */
async function handleNearMe() {
    const status = document.getElementById('location-status');
    if (status) {
        status.innerText = "Getting your location...";
        status.classList.remove('hidden');
    }

    if (!navigator.geolocation) {
        showAlert("Geolocation is not supported by your browser.", "error");
        if (status) status.classList.add('hidden');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            try {
                // Fetch all spots and filter by distance
                const allSpots = await api.getSpots();

                // Filter calculate distance and filter within 10km
                const nearSpots = allSpots
                    .map(spot => {
                        if (spot.latitude && spot.longitude) {
                            spot.distance = calculateDistance(userLat, userLng, spot.latitude, spot.longitude);
                        }
                        return spot;
                    })
                    .filter(spot => spot.distance && parseFloat(spot.distance) <= 10)
                    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                if (status) status.classList.add('hidden');

                // Render results in the grid
                const grid = document.getElementById('home-spots-grid');
                if (nearSpots.length === 0) {
                    grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No hidden spots near you yet. Be the first to add one!</p>';
                } else {
                    renderSpots(nearSpots, 'home-spots-grid');
                    showAlert(`Found ${nearSpots.length} spots near you!`);
                }

            } catch (error) {
                console.error("Error fetching near spots:", error);
                showAlert("Failed to load spots.", "error");
                if (status) status.classList.add('hidden');
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            if (error.code === 1) {
                showAlert("Please allow location access to use this feature", "error");
            } else {
                showAlert("Could not get your location.", "error");
            }
            if (status) status.classList.add('hidden');
        }
    );
}
