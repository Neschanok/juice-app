Understorychat

Dette er en webapplikation bygget med Node.js og Express, der fungerer som en platform til håndtering af aktiviteter, kalenderstyring og chat. Applikationen bruger en SQLite-database til datalagring og Firebase til administration.

## Funktioner

  * **Kalender:** Visning og styring af begivenheder (`calender.html`, `kalender.js`).
  * **Chat:** Real-time kommunikation eller beskedfunktion (`chat.html`).
  * **Oplevelser:** Visning af forskellige aktiviteter som bungyjump, klatring og windsurfing (`oplevelser.html`).
  * **Salg:** En salgsside (`sales.html`).
  * **Database:** Lokal SQLite database (`calendar.db`).

## Teknologier

  * **Backend:** Node.js, Express.js
  * **Database:** SQLite3
  * **Frontend:** HTML5, CSS3, JavaScript
  * **Andet:** Firebase Admin SDK

## Installation

Følg disse trin for at få projektet til at køre lokalt:

1.  **Klon repositoryet:**

    ```bash
    git clone https://github.com/neschanok/juice-app.git
    cd juice-app
    ```

2.  **Installer afhængigheder:**
    Sørg for, at du har [Node.js](https://nodejs.org/) installeret. Kør derefter:

    ```bash
    npm install
    ```

3.  **Konfiguration:**

      * Sørg for, at `calendar.db` ligger i roden af mappen (hvis den ikke oprettes automatisk af `database.js`).
      * Firebase: Dette projekt kræver en Firebase Service Account. Download din nøgle-fil fra Firebase Console, kald den serviceAccountKey.json og læg den i roden af mappen.

## Start Applikationen

For at starte serveren skal du køre:

```bash
node server.js
```

Eller hvis du har et start-script defineret i din `package.json`:

```bash
npm start
```

Åbn derefter din browser og gå til:
`http://localhost:3000` (eller den port, der er angivet i din `server.js` fil).

## 📂 Projektstruktur

Her er en oversigt over de vigtigste filer og mapper:

  * `server.js`: Hovedfilen der starter Express-serveren.
  * `database.js`: Håndterer forbindelsen til SQLite-databasen.
  * `firebaseAdmin.js`: Konfiguration til Firebase.
  * `calendar.db`: SQLite databasefilen.
  * `public/`: Indeholder statiske filer (frontend).
      * `index.html`, `home.html`: Landingssider.
      * `chat.html`, `calender.html`, `sales.html`: Funktionalitetssider.
      * `styles.css`: Global styling.
      * `kalender.js`: Logik til kalenderfunktionen.
      * `billeder/`: Indeholder billeder til aktiviteter (f.eks. Bungyjump.jpg, Climbing.jpg).

## Licens

Dette projekt er licenseret under MIT License.
