# Authentication Web App - Frontend med JWT

En modern webbapplikation som konsumerar Authentication Web Service (Uppgift 4.1) med JWT-autentisering. Byggd med ren HTML, CSS och JavaScript med Fetch API. [Länk](https://dt207g-moment4-backend-w92d.onrender.com)

## Funktionalitet

- **Användarregistrering** - Formulär för att skapa nya konton
- **Säker inloggning** - Autentisering med JWT-tokens
- **Skyddad dashboard** - Kräver inloggning för åtkomst
- **Sessionshantering** - JWT lagras i sessionStorage
- **Automatisk omdirigering** - Baserat på autentiseringsstatus
- **Responsiv design** - Fungerar på alla enheter

## Teknisk stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Autentisering**: JWT-tokens via sessionStorage
- **API-kommunikation**: Fetch API
- **Design**: Modern CSS med Font Awesome-ikoner
- **Utvecklingsmiljö**: Statisk webbserver

## Sidstruktur

### index.html

Startsida med:

- Hero-sektion med call-to-action
- Funktionsöversikt
- API-statusindikator
- Dynamisk navigation baserat på inloggningsstatus

### register.html

Registreringsformulär med:

- Användarnamn (obligatoriskt)
- E-postadress (obligatoriskt)
- Lösenord (minimum 6 tecken)
- Fullständigt namn (valfritt)
- Realtidsvalidering och felhantering

### login.html

Inloggningsformulär med:

- Användarnamn eller e-post
- Lösenord
- Automatisk omdirigering till dashboard vid framgång
- Felmeddelanden för ogiltiga uppgifter

### dashboard.html (Skyddad sida)

Personlig dashboard som kräver inloggning:

- **Min profil** - Visar användarinformation från JWT
- **Alla användare** - Lista över registrerade användare
- **Användarprofiler** - Visar skapade profiler
- **Skapa profil** - Formulär för att skapa användarprofil

## JWT-hantering

### Token-lagring

```javascript
// Spara JWT efter inloggning
sessionStorage.setItem("authToken", token);
sessionStorage.setItem("userData", JSON.stringify(user));

// Hämta token för API-anrop
const token = sessionStorage.getItem("authToken");
```

### Autentiserade API-anrop

```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    throw new Error("Ingen autentiseringstoken hittades");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Token ogiltig - logga ut användaren
    logout();
    throw new Error("Session har gått ut");
  }

  return response;
};
```

### Automatisk autentiseringskontroll

```javascript
const checkAuthStatus = () => {
  const token = sessionStorage.getItem("authToken");
  const userData = sessionStorage.getItem("userData");

  if (token && userData) {
    // Användare är inloggad
    updateNavigation(true);
    return JSON.parse(userData);
  } else {
    // Användare är inte inloggad
    updateNavigation(false);
    return null;
  }
};
```

## API-integration

### Konfiguration

```javascript
const API_BASE_URL = "http://localhost:3000";
```

### Registrering

```javascript
const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registrering misslyckades");
  }

  return response.json();
};
```

### Inloggning

```javascript
const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Inloggning misslyckades");
  }

  const data = await response.json();

  // Spara JWT och användardata
  sessionStorage.setItem("authToken", data.token);
  sessionStorage.setItem("userData", JSON.stringify(data.user));

  return data;
};
```

### Skyddade resurser

```javascript
const fetchUserProfile = async () => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/api/profile`
  );
  return response.json();
};

const fetchAllUsers = async () => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/users`);
  return response.json();
};
```

## Säkerhetsfunktioner

### Automatisk utloggning

- Vid ogiltiga JWT-tokens (401/403)
- När token saknas för skyddade sidor
- Manuell utloggning rensar sessionStorage

### Sidskydd

```javascript
const requireAuth = () => {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    // Omdirigera till inloggningssida
    window.location.href = "login.html";
    return false;
  }

  return true;
};

// Används på dashboard.html
if (!requireAuth()) {
  // Sidan laddas inte om användaren inte är autentiserad
}
```

### Formulärvalidering

- **Realtidsvalidering** av användarinput
- **Lösenordsstyrka** kontrolleras på frontend
- **E-postformat** valideras
- **Felmeddelanden** visas tydligt för användaren

## Projektstruktur

```
Uppgift4.2/
├── index.html              # Startsida med hero och funktioner
├── register.html           # Registreringsformulär
├── login.html              # Inloggningsformulär
├── dashboard.html          # Skyddad dashboard (kräver JWT)
├── css/
│   └── style.css          # Modern responsiv CSS
├── js/
│   ├── config.js          # API-konfiguration
│   ├── auth.js            # JWT-hantering och autentisering
│   ├── main.js            # Startsida-funktionalitet
│   ├── register.js        # Registreringslogik
│   ├── login.js           # Inloggningslogik
│   └── dashboard.js       # Dashboard-funktionalitet
└── package.json           # NPM-konfiguration
```

## Användarupplevelse

### Navigation

- **Dynamisk navigation** som ändras baserat på inloggningsstatus
- **Hamburger-meny** för mobila enheter
- **Aktiv sida** markeras tydligt

### Feedback

- **Loading-indikatorer** under API-anrop
- **Framgångsmeddelanden** vid lyckade operationer
- **Felmeddelanden** med tydliga instruktioner
- **API-statusindikator** på startsidan

## Dashboard-funktioner

### Min profil

Visar inloggad användares information:

- Användarnamn och e-post
- Fullständigt namn
- Registreringsdatum
- Data hämtas från JWT och API

### Alla användare

Lista över alla registrerade användare:

- Användarnamn och e-post
- Registreringsdatum
- Antal användare visas
- Kräver giltig JWT för åtkomst

### Användarprofiler

Visar skapade användarprofiler:

- Biografi, plats och webbsida
- Kopplad till användarnamn
- Skapandedatum

### Skapa profil

Formulär för att skapa användarprofil:

- Biografi (textarea)
- Plats (text)
- Webbsida (URL)
- Alla fält är valfria

## Felhantering

### Nätverksfel

```javascript
const handleNetworkError = (error) => {
  if (error.message.includes("fetch")) {
    return "Kunde inte ansluta till servern. Kontrollera att API:et körs.";
  }
  return error.message;
};
```

### JWT-fel

- **Token saknas**: Omdirigering till inloggning
- **Token ogiltig**: Automatisk utloggning
- **Token utgången**: Meddelande och omdirigering

### Användarfel

- **Felaktiga inloggningsuppgifter**: Tydligt felmeddelande
- **Användare finns redan**: Information om befintligt konto
- **Validering**: Realtidsvalidering av formulärfält

## Utvecklingsprocess och slutsatser

Under utvecklingen har jag lärt mig:

### JWT-autentisering

- **Token-baserad autentisering** vs session-baserad
- **Säker lagring** av tokens i webbläsaren
- **Automatisk förnyelse** och felhantering

### Frontend-säkerhet

- **Skydd av känsliga sidor** med JavaScript
- **Validering på både klient och server**
- **Säker kommunikation** med backend-API

### Användarupplevelse

- **Smidig navigation** mellan autentiserade och publika sidor
- **Tydlig feedback** för alla användarinteraktioner
- **Responsiv design** för alla enheter
