// Utility functions for the Hiddenly Frontend

// Get a URL parameter by name
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Redirect to another internal page
function navigateTo(page) {
    if (page.includes('.html')) {
        window.location.href = page;
        return;
    }
    
    // Split by '?' to handle query params
    const parts = page.split('?');
    const path = parts[0];
    const query = parts[1] ? '?' + parts[1] : '';
    
    window.location.href = path + '.html' + query;
}

// Show a beautiful custom Toast message instead of native alert
function showAlert(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <i class="fas fa-times toast-close" onclick="this.parentElement.classList.remove('active'); setTimeout(() => this.parentElement.remove(), 500);"></i>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('active'), 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }
    }, 5000);
}

// Haversine formula to calculate distance between two lat/lng points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Format a date string into a readable format (e.g. 1st Jan 2025)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Toggle the global loader overlay
function toggleLoader(show, message = 'Loading... Please wait') {
    let loader = document.getElementById('global-loader');
    
    // Create it if it doesn't exist
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'loader-overlay hidden';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p class="loader-text" id="global-loader-text">${message}</p>
        `;
        document.body.appendChild(loader);
    }

    const textEl = document.getElementById('global-loader-text');
    if (textEl) textEl.innerText = message;

    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// --- SIDEBAR & NAVIGATION ---
function toggleSidebar(show) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.nav-overlay');
    
    if (show) {
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
    } else {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
}

// Help & Contact Info
function showHelp() {
    navigateTo('help');
}

function showContactInfo() {
    navigateTo('contact');
}

// Initialize Global Elements
document.addEventListener('DOMContentLoaded', () => {
    // Add overlay if missing
    if (!document.querySelector('.nav-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.onclick = () => toggleSidebar(false);
        document.body.appendChild(overlay);
    }

    // Auto-setup any hamburger icons
    document.querySelectorAll('.hamburger').forEach(h => {
        h.addEventListener('click', () => toggleSidebar(true));
    });
});
