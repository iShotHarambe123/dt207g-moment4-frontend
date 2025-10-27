// Huvudapplikationen
document.addEventListener('DOMContentLoaded', function () {
    // Uppdatera navigation baserat på inloggningsstatus
    auth.updateNavigation();

    // Kontrollera API-status
    checkApiStatus();

    // Mobilmeny-växling
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});

// Kontrollera API-status
async function checkApiStatus() {
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');

    if (!statusIcon || !statusText) return;

    try {
        const response = await fetch(utils.getApiUrl('/'));

        if (response.ok) {
            statusIcon.className = 'fas fa-circle status-online';
            statusText.textContent = 'API är online och tillgänglig';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        statusIcon.className = 'fas fa-circle status-offline';
        statusText.textContent = 'API är offline eller otillgänglig';
    }
}