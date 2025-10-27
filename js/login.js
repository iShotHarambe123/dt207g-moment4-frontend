// Inloggningssidan
document.addEventListener('DOMContentLoaded', function () {
    // Omdirigera om redan inloggad
    if (auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const authMessage = document.getElementById('authMessage');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Validera indata
        if (!credentials.username || !credentials.password) {
            utils.showError(authMessage, 'Alla fält måste fyllas i');
            return;
        }

        // Visa laddningstillstånd
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loggar in...';
        submitButton.disabled = true;

        try {
            const result = await auth.login(credentials);

            utils.showSuccess(authMessage, 'Inloggning lyckades! Omdirigerar...');

            // Omdirigera till dashboard efter kort fördröjning
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            utils.showError(authMessage, error.message);

            // Återställ knapp
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
});