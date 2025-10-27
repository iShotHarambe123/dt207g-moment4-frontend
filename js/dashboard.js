// Dashboardsidan
document.addEventListener('DOMContentLoaded', function () {
    // Kräv autentisering
    if (!auth.requireAuth()) {
        return;
    }

    // Ladda dashboarddata
    loadDashboardData();

    // Konfigurera formulär för att skapa profil
    setupCreateProfileForm();
});

// Ladda all dashboarddata
async function loadDashboardData() {
    await Promise.all([
        loadUserProfile(),
        loadAllUsers(),
        loadUserProfiles()
    ]);
}

// Ladda nuvarande användarprofil
async function loadUserProfile() {
    const profileContent = document.getElementById('profileContent');

    try {
        const data = await auth.apiCall(API_CONFIG.ENDPOINTS.PROFILE);

        profileContent.innerHTML = `
            <div class="profile-info">
                <div class="profile-item">
                    <i class="fas fa-user"></i>
                    <span class="label">Användarnamn:</span>
                    <span class="value">${data.user.username}</span>
                </div>
                <div class="profile-item">
                    <i class="fas fa-envelope"></i>
                    <span class="label">E-post:</span>
                    <span class="value">${data.user.email}</span>
                </div>
                <div class="profile-item">
                    <i class="fas fa-id-card"></i>
                    <span class="label">Fullständigt namn:</span>
                    <span class="value">${data.user.full_name || 'Ej angivet'}</span>
                </div>
                <div class="profile-item">
                    <i class="fas fa-calendar"></i>
                    <span class="label">Registrerad:</span>
                    <span class="value">${utils.formatDate(data.user.account_created)}</span>
                </div>
            </div>
        `;
    } catch (error) {
        utils.showError(profileContent, `Kunde inte ladda profil: ${error.message}`);
    }
}

// Ladda alla användare
async function loadAllUsers() {
    const usersContent = document.getElementById('usersContent');

    try {
        const data = await auth.apiCall(API_CONFIG.ENDPOINTS.USERS);

        if (data.users.length === 0) {
            usersContent.innerHTML = '<p class="no-data">Inga användare hittades</p>';
            return;
        }

        const usersList = data.users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <div class="user-details">
                        <strong>${user.username}</strong>
                        <span class="user-email">${user.email}</span>
                        <small class="user-date">Registrerad: ${utils.formatDate(user.account_created)}</small>
                    </div>
                </div>
            </div>
        `).join('');

        usersContent.innerHTML = `
            <div class="users-header">
                <span class="users-count">${data.count} användare totalt</span>
            </div>
            <div class="users-list">
                ${usersList}
            </div>
        `;
    } catch (error) {
        utils.showError(usersContent, `Kunde inte ladda användare: ${error.message}`);
    }
}

// Ladda användarprofiler
async function loadUserProfiles() {
    const userProfilesContent = document.getElementById('userProfilesContent');

    try {
        const data = await auth.apiCall(API_CONFIG.ENDPOINTS.USER_PROFILES);

        if (data.profiles.length === 0) {
            userProfilesContent.innerHTML = '<p class="no-data">Inga användarprofiler hittades</p>';
            return;
        }

        const profilesList = data.profiles.map(profile => `
            <div class="user-profile-item">
                <div class="profile-header">
                    <i class="fas fa-id-card"></i>
                    <strong>${profile.username}</strong>
                    <span class="profile-email">${profile.email}</span>
                </div>
                <div class="profile-details">
                    ${profile.bio ? `<p class="bio"><i class="fas fa-quote-left"></i> ${profile.bio}</p>` : ''}
                    ${profile.location ? `<p class="location"><i class="fas fa-map-marker-alt"></i> ${profile.location}</p>` : ''}
                    ${profile.website ? `<p class="website"><i class="fas fa-globe"></i> <a href="${profile.website}" target="_blank">${profile.website}</a></p>` : ''}
                    <small class="created-date">Skapad: ${utils.formatDate(profile.created_at)}</small>
                </div>
            </div>
        `).join('');

        userProfilesContent.innerHTML = `
            <div class="profiles-header">
                <span class="profiles-count">${data.count} profiler totalt</span>
            </div>
            <div class="profiles-list">
                ${profilesList}
            </div>
        `;
    } catch (error) {
        utils.showError(userProfilesContent, `Kunde inte ladda profiler: ${error.message}`);
    }
}

//  formulär för att skapa profil
function setupCreateProfileForm() {
    const createProfileForm = document.getElementById('createProfileForm');
    const profileMessage = document.getElementById('profileMessage');

    createProfileForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(createProfileForm);
        const profileData = {
            bio: formData.get('bio'),
            location: formData.get('location'),
            website: formData.get('website')
        };

        // Visa laddningstillstånd
        const submitButton = createProfileForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sparar...';
        submitButton.disabled = true;

        try {
            await auth.apiCall(API_CONFIG.ENDPOINTS.USER_PROFILES, {
                method: 'POST',
                body: JSON.stringify(profileData)
            });

            utils.showSuccess(profileMessage, 'Profil skapad framgångsrikt!');

            // Återställ formulär
            createProfileForm.reset();

            // Ladda om användarprofiler
            setTimeout(() => {
                loadUserProfiles();
                profileMessage.innerHTML = '';
            }, 2000);

        } catch (error) {
            utils.showError(profileMessage, `Kunde inte skapa profil: ${error.message}`);
        } finally {
            // Återställ knapp
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

