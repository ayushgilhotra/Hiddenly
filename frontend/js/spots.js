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
        <div class="card" onclick="navigateTo('spot?id=${spot.id}')">
            <img src="${spot.imageUrl}" alt="${spot.name}" class="card-img" onerror="if(!this.dataset.tried) { this.dataset.tried=true; this.src='${defaultImg}'; }">
            <div class="card-content">
                <span class="badge badge-category">${spot.category}</span>
                <h3 class="mt-20">${spot.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${spot.location}</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="badge badge-budget">${spot.budgetRange}</span>
                    <span class="badge" style="background: rgba(212, 168, 83, 0.1); color: var(--primary); border: 1px solid rgba(212, 168, 83, 0.2);"><i class="fas fa-users"></i> ${spot.personsCount || 0}</span>
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

// --- FUNCTION: Load and filter spots (for Explore Page) ---
async function loadExploreSpots() {
    try {
        const category = getUrlParam('category') || 'ALL';
        let spots;

        if (category === 'ALL') {
            spots = await api.getSpots();
        } else {
            spots = await api.getSpotsByCategory(category);
        }

        renderSpots(spots, 'explore-spots-grid');

        // Update title if category is selected
        const title = document.getElementById('explore-title');
        if (title) title.innerText = category === 'ALL' ? 'Explore all Hidden Gems' : `Hidden ${category} Gems`;

    } catch (error) {
        console.error('Failed to load explore spots:', error);
    }
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
