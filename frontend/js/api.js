// This file connects our frontend to our Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle fetch and errors in one place
async function apiCall(endpoint, method = 'GET', body = null, authenticated = false) {
    // 1. Setup headers
    const headers = {
        'Content-Type': 'application/json'
    };

    // 2. If authenticated, add the JWT token from localStorage
    if (authenticated) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // 3. Prepare the request options
    const options = {
        method: method,
        headers: headers
    };

    // 4. Add body if provided
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        // 5. Send the request
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // 6. Check if response is successful
        if (!response.ok) {
            // If the error is 401 (Unauthorized) or 403 (Forbidden), 
            // it means our token is old, invalid, or missing.
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');

                // Only redirect if we are not already on the login page
                if (!window.location.href.includes('login.html')) {
                    alert('Session expired. Please login again.');
                    window.location.href = 'login.html';
                }
            }

            const errorData = await response.text();
            throw new Error(errorData || 'API request failed');
        }

        // 7. Parse JSON if there is content
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('API Error:', error.message);
        throw error; // Let the caller handle it
    }
}

// --- AUTH API CALLS ---
const api = {
    register: (userData) => apiCall('/auth/register', 'POST', userData),
    login: (credentials) => apiCall('/auth/login', 'POST', credentials),

    // --- SPOTS API CALLS ---
    getSpots: () => apiCall('/spots'),
    getSpotById: (id) => apiCall(`/spots/${id}`),
    getSpotsByCategory: (cat) => apiCall(`/spots/category/${cat}`),
    addSpot: (spotData) => apiCall('/spots', 'POST', spotData, true),
    updateSpot: (id, spotData) => apiCall(`/spots/${id}`, 'PUT', spotData, true),
    deleteSpot: (id) => apiCall(`/spots/${id}`, 'DELETE', null, true)
};
