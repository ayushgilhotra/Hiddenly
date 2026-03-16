// This file connects our frontend to our Spring Boot backend
// Automatically use localhost for development, and the live Render URL for production.
const IS_LOCAL = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.hostname.startsWith('192.168.') || 
                 window.location.hostname.startsWith('10.');
const PRODUCTION_API_URL = 'https://hiddenly.onrender.com/api'; // Live Render URL
const API_BASE_URL = IS_LOCAL ? `http://${window.location.hostname}:8080/api` : PRODUCTION_API_URL;

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
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, options);

        // 6. Check if response is successful
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');

                if (!window.location.href.includes('login.html')) {
                    showAlert('Session expired. Please login again.', 'error');
                    window.location.href = 'login.html';
                }
            }

            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorText;
            } catch (e) {}
            
            throw new Error(errorMessage || 'API request failed');
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            console.error('Connection Error:', `Could not connect to ${API_BASE_URL}. Ensure the backend is running and matches this URL.`);
            throw new Error(`Connection Error: Ensure your backend is running at ${API_BASE_URL}`);
        }
        console.error('API Error:', error.message);
        throw error;
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
    deleteSpot: (id) => apiCall(`/spots/${id}`, 'DELETE', null, true),

    // --- REVIEWS API CALLS ---
    addReview: (reviewData) => apiCall('/reviews', 'POST', reviewData, true),

    // --- UPLOAD API CALLS ---
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorText;
            } catch (e) {
                // Not JSON, use raw text
            }
            throw new Error(errorMessage || `Upload failed with status ${response.status}`);
        }

        return await response.json();
    }
};
