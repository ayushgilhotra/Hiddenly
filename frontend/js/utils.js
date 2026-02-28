// Helper functions for various tasks

// Show an alert message to the user
function showAlert(message, type = 'success') {
    alert(message); // Simple alert for now (Beginner Friendly)
}

// Redirect the user to a new page
function navigateTo(page) {
    window.location.href = page;
}

// Get parameters from the URL (e.g., getting ?id=123)
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Format a date string into something readable
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
