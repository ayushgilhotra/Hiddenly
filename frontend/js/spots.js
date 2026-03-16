// This file contains logic for showing spots on the UI (cards, lists, etc.)

// --- HELPER: Get proper image URL logic ---
function getProperImageUrl(url, category) {
    const fallbacks = {
        'CAFE': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
        'NATURE': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
        'FOOD': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'ADVENTURE': 'https://images.unsplash.com/photo-1533240332313-0bc499f50e10',
        'OTHER': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    };
    const defaultImg = fallbacks[category] || fallbacks['OTHER'];
    if (!url) return defaultImg;

    let finalSrc = url;

    try {
        // 1. If it's a relative path (doesn't start with http or //)
        if (!finalSrc.startsWith('http') && !finalSrc.startsWith('//')) {
            const base = API_BASE_URL.replace('/api', ''); // Get http://host:port
            finalSrc = base + (finalSrc.startsWith('/') ? '' : '/') + finalSrc;
        }

        // 2. If it points to localhost:8080 but we are on a different host (e.g. mobile)
        if (finalSrc.includes('localhost:8080') && typeof API_BASE_URL !== 'undefined') {
            const backendHost = new URL(API_BASE_URL).host; 
            finalSrc = finalSrc.replace('localhost:8080', backendHost);
        }
    } catch (e) {
        console.warn("Could not fix image URL:", e);
    }
    
    return finalSrc;
}

// --- FUNCTION: Create the HTML for a single spot card ---
function createSpotCard(spot) {
    const finalSrc = getProperImageUrl(spot.imageUrl, spot.category);
    const defaultImg = getProperImageUrl('', spot.category); // Get default fallback



    return `
        <div class="card spot-card animate-up" id="spot-card-${spot.id}" data-id="${spot.id}" onclick="handleCardClick(${spot.id}, ${spot.latitude}, ${spot.longitude})">
            <img src="${finalSrc}" alt="${spot.name}" class="card-img" onerror="this.src='${defaultImg}'">
            <div class="card-content">
                <span class="badge badge-category">${spot.category}</span>
                <h3 class="mt-20">${spot.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${spot.location}</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                    <span class="badge badge-budget">${spot.budgetRange}</span>
                    <span class="badge" style="background: rgba(212, 168, 83, 0.1); color: var(--primary); border: 1px solid rgba(212, 168, 83, 0.2);"><i class="fas fa-users"></i> ${spot.personsCount || 0}</span>
                    ${spot.averageRating > 0 ? `<span style="color: var(--primary); font-size: 0.85rem; font-weight: bold;"><i class="fas fa-star"></i> ${spot.averageRating.toFixed(1)}</span>` : ''}
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
    toggleLoader(true, 'Finding hidden gems...');
    try {
        const category = getUrlParam('category') || 'ALL';
        const view = getUrlParam('view'); // 'map' or default (list)
        const nearMe = getUrlParam('nearMe') === 'true';
        const radiusParam = getUrlParam('radius');
        const radius = radiusParam ? parseFloat(radiusParam) : 10; 

        let spots;
        if (category === 'ALL') {
            spots = await api.getSpots();
        } else {
            spots = await api.getSpotsByCategory(category);
        }

        // --- NEAR ME FILTERING ---
        if (nearMe) {
            try {
                const userPos = await getUserLocation();
                spots = spots
                    .map(spot => {
                        if (spot.latitude && spot.longitude) {
                            spot.distance = calculateDistance(userPos.lat, userPos.lng, spot.latitude, spot.longitude);
                        }
                        return spot;
                    })
                    .filter(spot => spot.distance && parseFloat(spot.distance) <= radius)
                    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                if (spots.length > 0) {
                    showAlert(`Found ${spots.length} spots within ${radius}km!`);
                } else {
                    showAlert(`No spots found within ${radius}km of your location.`, "info");
                }
            } catch (err) {
                console.error("Near Me geolocation failed:", err);
                showAlert("Could not get your location for Near Me search.", "error");
            }
        }

        // 1. Render Cards
        renderSpots(spots, 'explore-spots-grid');

        // 2. Handle Views & Map
        const mapSection = document.getElementById('map-section');
        const listView = document.querySelector('.explore-list-view');

        if (view === 'map') {
            if (listView) listView.style.display = 'none';
            if (mapSection) {
                mapSection.classList.remove('hidden');
                mapSection.style.marginTop = '0';
                mapSection.querySelector('h2').innerText = 'Full Hidden Map';
                mapSection.querySelector('button').style.display = 'none'; 
            }
            if (!exploreMap) exploreMap = await initDarkMap('explore-map', { zoom: 5 });
            renderMapMarkers(spots);
        } else if (nearMe && spots.length > 0) {
            // Show map automatically for nearMe search results
            if (mapSection) {
                mapSection.classList.remove('hidden');
                if (!exploreMap) exploreMap = await initDarkMap('explore-map', { zoom: 12 });
                renderMapMarkers(spots);
            }
        }

        // Update Title
        const title = document.getElementById('explore-title');
        if (title) {
            let titleText = category === 'ALL' ? 'Explore all Hidden Gems' : `Hidden ${category} Gems`;
            if (nearMe) titleText = `Spots within ${radius}km`;
            title.innerText = titleText;
        }

    } catch (error) {
        console.error('Failed to load explore spots:', error);
    } finally {
        toggleLoader(false);
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
            const marker = createSpotMarker(exploreMap, pos, spot.name, spot.category);

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
async function handleCardClick(spotId, lat, lng) {
    if (!lat || !lng) {
        navigateTo(`spot?id=${spotId}`);
        return;
    }

    // Show Map Section
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
        mapSection.classList.remove('hidden');
        mapSection.scrollIntoView({ behavior: 'smooth' });

        if (!exploreMap) {
            exploreMap = await initDarkMap('explore-map', { center: { lat, lng }, zoom: 15 });
            addLocateMeButton(exploreMap);
        }

        // Find the spot to render its marker
        api.getSpotById(spotId).then(spot => {
            renderMapMarkers([spot]);
            exploreMap.panTo({ lat, lng });
        });
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

        const finalSrc = getProperImageUrl(spot.imageUrl, spot.category);
        const defaultImg = getProperImageUrl('', spot.category); // Get default fallback

        spotImg.src = finalSrc;

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

        // --- GOOGLE SEARCH FOR IMAGE (Optional Fix Suggestion) ---
        // If the user's image is a Google Search thumbnail, it might be broken.
        // We'll keep the current logic but we can later add better validation.

        // --- REVIEWS LOGIC ---
        renderAverageRating(spot.averageRating);
        renderReviewsList(spot.reviews);

        // Show/Hide Review Form based on Auth
        const token = localStorage.getItem('token');
        if (token) {
            document.getElementById('add-review-container').classList.remove('hidden');
            document.getElementById('login-to-review').classList.add('hidden');

            // Setup Review Form submission
            const reviewForm = document.getElementById('review-form');
            if (reviewForm) {
                // BUG FIX: Mobile browsers sometimes don't trigger radio inputs when clicking labels in flex-reverse.
                // Explicitly bind the click events to the labels to check the corresponding input.
                const starLabels = reviewForm.querySelectorAll('.star-rating label');
                starLabels.forEach(label => {
                    label.addEventListener('click', () => {
                        const inputId = label.getAttribute('for');
                        if (inputId) {
                            const radioBtn = document.getElementById(inputId);
                            if (radioBtn) radioBtn.checked = true;
                        }
                    });
                });

                reviewForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const rating = reviewForm.querySelector('input[name="rating"]:checked')?.value;
                    const comment = document.getElementById('review-comment').value;

                    if (!rating) {
                        showAlert('Please select a rating', 'error');
                        return;
                    }

                    try {
                        const reviewData = {
                            spotId: spot.id,
                            rating: parseInt(rating),
                            comment: comment
                        };
                        await api.addReview(reviewData);
                        showAlert('Review added successfully!');
                        // Reload spot details to show new review and updated average
                        loadSpotDetails();
                        // Reset form
                        reviewForm.reset();
                    } catch (err) {
                        showAlert(err.message, 'error');
                    }
                };
            }
        } else {
            document.getElementById('add-review-container').classList.add('hidden');
            document.getElementById('login-to-review').classList.remove('hidden');
        }

        // --- MAP INTEGRATION ---
        const mapSection = document.getElementById('spot-map-section');
        const mapContainer = document.getElementById('detail-map');

        if (spot.latitude && spot.longitude && mapContainer) {
            mapSection.classList.remove('hidden');
            const pos = { lat: spot.latitude, lng: spot.longitude };
            const detailMap = await initDarkMap('detail-map', {
                center: pos,
                zoom: 15
            });
            createSpotMarker(detailMap, pos, spot.name, spot.category);

            // Optional: Show user location on detail map too
            getUserLocation().then(userPos => {
                showUserMarker(detailMap, userPos);
                // Adjust bounds to show both user and spot if reasonably close
                const distance = calculateDistance(userPos.lat, userPos.lng, pos.lat, pos.lng);
                if (distance < 50) { // Only fit bounds if within 50km
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(pos);
                    bounds.extend(userPos);
                    detailMap.fitBounds(bounds);
                }
            }).catch(e => console.log("User location not available for detail map"));

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
            toggleLoader(true, 'Deleting your secret... Please wait');
            await api.deleteSpot(id);
            showAlert('Spot deleted successfully!');
            navigateTo('explore');
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            toggleLoader(false);
        }
    }
}

/**
 * Handles the "Explore Near Me" button click on Home page
 * Prompts for radius and redirects to Explore page
 */
async function handleNearMe() {
    const radius = prompt("Enter search radius in km (e.g. 5, 10, 0.5):", "10");
    if (radius === null) return; // User cancelled

    const r = parseFloat(radius);
    if (isNaN(r) || r <= 0) {
        showAlert("Please enter a valid positive number for radius.", "error");
        return;
    }

    navigateTo(`explore?nearMe=true&radius=${r}`);
}

/**
 * Renders the average rating stars
 */
function renderAverageRating(rating) {
    const container = document.getElementById('avg-rating');
    if (!container) return;

    if (!rating || rating === 0) {
        container.innerHTML = 'No ratings yet';
        return;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    let html = `<span>${rating.toFixed(1)} </span>`;
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            html += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            html += '<i class="fas fa-star-half-alt"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    container.innerHTML = html;
}

/**
 * Renders the list of reviews
 */
function renderReviewsList(reviews) {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--text-muted);">No reviews yet. Be the first to share your experience!</p>';
        return;
    }

    container.innerHTML = [...reviews].reverse().map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <span class="review-user">${review.user.name}</span>
                    <div class="review-stars">
                        ${generateStarsHtml(review.rating)}
                    </div>
                </div>
                <span class="review-date">${formatDate(review.createdAt)}</span>
            </div>
            ${review.comment ? `<p class="review-comment">"${review.comment}"</p>` : ''}
        </div>
    `).join('');
}

/**
 * Helper to generate stars for a given rating
 */
function generateStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return html;
}
