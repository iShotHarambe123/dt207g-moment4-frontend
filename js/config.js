// API-konfiguration
const API_CONFIG = {
    BASE_URL: 'https://dt207g-moment4-backend-w92d.onrender.com',
    ENDPOINTS: {
        REGISTER: '/api/register',
        LOGIN: '/api/login',
        PROFILE: '/api/profile',
        USERS: '/api/users',
        USER_PROFILES: '/api/user-profiles'
    }
};

// Lagringsnycklar
const STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'currentUser'
};

// Hjälpfunktioner
const utils = {
    // Hämta fullständig API-URL
    getApiUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,

    // Formatera datum
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Visa laddningstillstånd
    showLoading: (element, message = 'Laddar...') => {
        element.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                ${message}
            </div>
        `;
    },

    // Visa felmeddelande
    showError: (element, message) => {
        element.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            </div>
        `;
    },

    // Visa sccuess smeddelande
    showSuccess: (element, message) => {
        element.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                ${message}
            </div>
        `;
    }
};