// Autentiseringshantering
class AuthManager {
    constructor() {
        // Hämtar sparad token och användarinfo från sessionStorage
        this.token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
        this.user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER) || 'null');
        console.log('AuthManager initierad, inloggad:', !!this.token);
    }

    // Kollar om användaren är inloggad
    isAuthenticated() {
        return !!this.token;
    }

    // Hämtar nuvarande användare
    getCurrentUser() {
        return this.user;
    }

    // Hämtar JWT-token
    getToken() {
        return this.token;
    }

    // Sparar autentiseringsdata efter lyckad inloggning
    setAuth(token, user) {
        this.token = token;
        this.user = user;
        sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        console.log('Användare inloggad:', user.username);
    }

    // Rensar autentiseringsdata vid utloggning
    clearAuth() {
        console.log('Loggar ut användare:', this.user?.username);
        this.token = null;
        this.user = null;
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
    }

    // Skapar headers för API-anrop med JWT-token
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Lägger till JWT-token om användaren är inloggad
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Gör autentiserat API-anrop med JWT-token
    async apiCall(endpoint, options = {}) {
        const url = utils.getApiUrl(endpoint);
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            console.log('Gör API-anrop till:', endpoint);
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'API-anrop misslyckades');
            }

            return data;
        } catch (error) {
            console.error('API-anropsfel:', error);
            throw error;
        }
    }

    // Registrerar ny användare
    async register(userData) {
        try {
            console.log('Försöker registrera användare:', userData.username);
            const response = await fetch(utils.getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Registrering misslyckades');
            }

            console.log('Användare registrerad framgångsrikt');
            return data;
        } catch (error) {
            console.error('Registreringsfel:', error);
            throw error;
        }
    }

    // Loggar in användare
    async login(credentials) {
        try {
            console.log('Försöker logga in användare:', credentials.username);
            const response = await fetch(utils.getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Inloggning misslyckades');
            }

            // Sparar JWT-token och användarinfo
            this.setAuth(data.token, data.user);
            console.log('Inloggning lyckades, JWT-token sparad');

            return data;
        } catch (error) {
            console.error('Inloggningsfel:', error);
            throw error;
        }
    }

    // Loggar ut användare
    logout() {
        this.clearAuth();
        window.location.href = 'index.html'; // Tillbaka till startsidan
    }

    // Kollar om sidan kräver inloggning
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.log('Sida kräver inloggning, omdirigerar...');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Uppdaterar navigationen baserat på inloggningsstatus
    updateNavigation() {
        const loginNav = document.getElementById('loginNav');
        const registerNav = document.getElementById('registerNav');
        const logoutNav = document.getElementById('logoutNav');
        const dashboardNav = document.getElementById('dashboardNav');
        const heroLogin = document.getElementById('heroLogin');
        const heroRegister = document.getElementById('heroRegister');
        const heroDashboard = document.getElementById('heroDashboard');

        if (this.isAuthenticated()) {
            // Användaren är inloggad = visa dashboard-länkar
            if (loginNav) loginNav.style.display = 'none';
            if (registerNav) registerNav.style.display = 'none';
            if (logoutNav) logoutNav.style.display = 'block';
            if (dashboardNav) dashboardNav.style.display = 'block';
            if (heroLogin) heroLogin.style.display = 'none';
            if (heroRegister) heroRegister.style.display = 'none';
            if (heroDashboard) heroDashboard.style.display = 'inline-block';
        } else {
            // Användaren är inte inloggad = visa login/register-länkar
            if (loginNav) loginNav.style.display = 'block';
            if (registerNav) registerNav.style.display = 'block';
            if (logoutNav) logoutNav.style.display = 'none';
            if (dashboardNav) dashboardNav.style.display = 'none';
            if (heroLogin) heroLogin.style.display = 'inline-block';
            if (heroRegister) heroRegister.style.display = 'inline-block';
            if (heroDashboard) heroDashboard.style.display = 'none';
        }
    }
}

const auth = new AuthManager();

function logout() {
    auth.logout();
}