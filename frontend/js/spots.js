// This file contains logic for showing spots on the UI (cards, lists, etc.)

// --- FUNCTION: Create the HTML for a single spot card ---
function createSpotCard(spot) {
    // We use a template string (backticks) to build the HTML
    return `
        <div class="card" onclick="navigateTo('spot.html?id=${spot.id}')">
            <img src="${spot.imageUrl}" alt="${spot.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1542332213-9b5a5a3fad35'">
            <div class="card-content">
                <span class="badge badge-category">${spot.category}</span>
                <h3 class="mt-20">${spot.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${spot.location}</p>
                <span class="badge badge-budget">${spot.budgetRange}</span>
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
    if (!id) {
        navigateTo('index.html');
        return;
    }

    try {
        const spot = await api.getSpotById(id);

        // Fill the page with spot data
        document.getElementById('spot-name').innerText = spot.name;
        document.getElementById('spot-image').src = spot.imageUrl;
        document.getElementById('spot-category').innerText = spot.category;
        document.getElementById('spot-location').innerText = spot.location;
        document.getElementById('spot-budget').innerText = spot.budgetRange;
        document.getElementById('spot-description').innerText = spot.description;
        document.getElementById('spot-added-by').innerText = spot.addedBy.name;
        document.getElementById('spot-date').innerText = formatDate(spot.createdAt);

        // If the logged-in user is the owner, show the Edit/Delete buttons
        const currentUserEmail = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub : null;
        if (currentUserEmail === spot.addedBy.email) {
            document.getElementById('owner-controls').classList.remove('hidden');
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
            navigateTo('explore.html');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }
}
