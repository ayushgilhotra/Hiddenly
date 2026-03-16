// Logic for login, signup and session management

// Check if a user is currently logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Redirect if NOT logged in (for protected pages like add-spot.html)
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Perform Logout
function logout() {
    // Remove all session data
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    // Refresh to update UI (navbar, etc.)
    window.location.href = 'index.html';
}

// Update the Navbar and Sidebar based on login status
function updateNavbar() {
    const navAuthLinks = document.getElementById('nav-auth-links');
    const navUserInfo = document.getElementById('nav-user-info');
    const navUserName = document.getElementById('nav-user-name');
    
    // Sidebar elements
    const sideAddSpot = document.getElementById('side-add-spot');
    const sideLogout = document.getElementById('side-logout');

    if (isLoggedIn()) {
        const user = localStorage.getItem('userName');
        if (navAuthLinks) navAuthLinks.classList.add('hidden');
        if (navUserInfo) navUserInfo.classList.remove('hidden');
        if (navUserName) navUserName.innerText = `Hi, ${user}`;
        
        // Show sidebar auth items
        if (sideAddSpot) sideAddSpot.classList.remove('hidden');
        if (sideLogout) sideLogout.classList.remove('hidden');
    } else {
        if (navAuthLinks) navAuthLinks.classList.remove('hidden');
        if (navUserInfo) navUserInfo.classList.add('hidden');
        
        // Hide sidebar auth items
        if (sideAddSpot) sideAddSpot.classList.add('hidden');
        if (sideLogout) sideLogout.classList.add('hidden');
    }
}

// Run this on every page load to ensure navbar is correct
document.addEventListener('DOMContentLoaded', updateNavbar);
