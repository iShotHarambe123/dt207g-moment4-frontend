// Registreringssidans
document.addEventListener('DOMContentLoaded', function () {
    // Omdirigera om redan inloggad
    if (auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            full_name: formData.get('fullName')
        };

        const confirmPassword = formData.get('confirmPassword');

        // Validera indata
        if (!userData.username || !userData.email || !userData.password) {
            utils.showError(authMessage, 'Användarnamn, e-post och lösenord måste fyllas i');
            return;
        }

        if (userData.password !== confirmPassword) {
            utils.showError(authMessage, 'Lösenorden matchar inte');
            return;
        }

        if (userData.password.length < 6) {
            utils.showError(authMessage, 'Lösenordet måste vara minst 6 tecken långt');
            return;
        }

        // Visa laddningstillstånd
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skapar konto...';
        submitButton.disabled = true;

        try {
            const result = await auth.register(userData);

            utils.showSuccess(authMessage, 'Kontot skapades! Omdirigerar till inloggning...');

            // Omdirigera till inloggning efter kort fördröjning
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            utils.showError(authMessage, error.message);

            // Återställ knapp
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
});