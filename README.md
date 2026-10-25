# Atomic Pen Fighter

Atomic Pen Fighter is a browser-based recreation of the Bangladeshi school-bench pen game, with a native Android WebView wrapper.

## Project layout

```text
.
├── .github/workflows/         CI and Android debug APK build
├── android/                   Native Android wrapper and packaged web assets
├── docs/                      Architecture and contributor notes
├── public/                    Files served by Express / static hosting
│   ├── assets/                Images and app icons
│   ├── css/game.css           Generated, concatenated stylesheet
│   ├── js/
│   │   ├── pen-game.bundle.js Compiled web game engine
│   │   └── pwa-install.js     Generated PWA installer
│   ├── sw.js                  Offline cache / service worker
│   └── index.html             Web entry point for Express
├── scripts/                   Build and project-integrity checks
├── src/
│   ├── game/                  Game engine source status and migration notes
│   ├── pwa/install.js          Editable PWA installer source
│   └── styles/                Ordered, editable CSS modules
├── index.html                 Static-hosting entry point
├── server.js                  Express static server
└── package.json               Developer commands and dependencies
```

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run build
npm test
npm run dev
```

Open the local server at `http://localhost:3000`. The build concatenates the ordered stylesheet modules into one production CSS file, syncs it to the Android package, copies the PWA installer to the web runtime, and validates expected deployment files. Run `npm test` for structural smoke checks.

To build the native Android debug APK, open the `android/` folder in Android Studio and use **Build → Build APK(s)**, or run `./gradlew assembleDebug` from that folder with JDK 17 and Android SDK Platform 36 installed.

## Game engine source status

The complete game engine is currently checked in as compiled JavaScript bundles at `public/js/pen-game.bundle.js` and `android/app/src/main/assets/www/js/pen-game.bundle.js`. The original editable engine source modules are not present in this branch. These platform-specific bundles are deliberately kept unchanged; they are not split by arbitrary line ranges because that can break shared scope, initialization order, rendering, physics, or multiplayer.

See [the architecture notes](docs/ARCHITECTURE.md) for the safe module migration path.
