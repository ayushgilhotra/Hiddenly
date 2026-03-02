// Logic for login, signup and session management

// Check if a user is currently logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Redirect if NOT logged in (for protected pages like add-spot.html)
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login';
    }
}

// Perform Logout
function logout() {
    // Remove all session data
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    // Refresh to update UI (navbar, etc.)
    window.location.href = 'index';
}

// Update the Navbar based on login status
function updateNavbar() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const addSpotLink = document.getElementById('add-spot-link');
    const logoutLink = document.getElementById('logout-link');
    const userNameDisplay = document.getElementById('user-name');

    if (isLoggedIn()) {
        if (loginLink) loginLink.classList.add('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        if (addSpotLink) addSpotLink.classList.remove('hidden');
        if (logoutLink) logoutLink.classList.remove('hidden');
        if (userNameDisplay) {
            userNameDisplay.innerText = `Hello, ${localStorage.getItem('userName')}`;
            userNameDisplay.classList.remove('hidden');
        }
    } else {
        if (loginLink) loginLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        if (addSpotLink) addSpotLink.classList.add('hidden');
        if (logoutLink) logoutLink.classList.add('hidden');
        if (userNameDisplay) userNameDisplay.classList.add('hidden');
    }
}

// Run this on every page load to ensure navbar is correct
document.addEventListener('DOMContentLoaded', updateNavbar);
