// Helper functions for various tasks

// Show an alert message to the user
function showAlert(message, type = 'success') {
    if (type === 'info') {
        console.log("INFO:", message);
        // We could add a small toast here later
    } else {
        alert(message);
    }
}

// Redirect the user to a new page
function navigateTo(page) {
    if (!page.includes('.') && !page.includes('?')) {
        window.location.href = page + '.html';
    } else {
        window.location.href = page;
    }
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
