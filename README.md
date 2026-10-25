# Atomic Pen Fighter

Atomic Pen Fighter is a browser-based recreation of the Bangladeshi school-bench pen game, with a native Android WebView wrapper.

## Project layout

```text
.
├── android/                 Native Android wrapper (open this folder in Android Studio)
├── docs/                    Architecture and contributor notes
├── public/                  Files served by Express
│   ├── assets/              Images and app icons
│   ├── css/game.css         Generated runtime stylesheet
│   ├── js/
│   │   ├── pen-game.bundle.js  Compiled game engine
│   │   └── pwa-install.js      Generated PWA installer
│   ├── sw.js                Offline cache / service worker
│   └── index.html           Web entry point for Express
├── scripts/                 Build and project-integrity checks
├── src/
│   ├── game/                Notes on the current bundled engine
│   ├── pwa/install.js       Editable PWA installer source
│   └── styles/game.css      Editable stylesheet source
├── index.html               Static-hosting entry point
├── server.js                Express static server
└── package.json             Developer commands and dependencies
```

The Android project has its own packaged assets at
`android/app/src/main/assets/www/`. Keep the Android HTML and game bundle
platform-specific: they intentionally omit the browser install banner and
contain Android-specific invite-link behavior.

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run build
npm run check
npm run dev
```

Open the local server at `http://localhost:3000`. Run `npm test` to execute
the repository's structural smoke checks. The build command syncs the editable
stylesheet and PWA installer into their web/Android runtime locations, then
checks that the deployment files are present and referenced correctly.

To build the native Android debug APK, open the `android/` folder in Android
Studio and use **Build → Build APK(s)**, or run `./gradlew assembleDebug` from
that folder with JDK 17 and Android SDK Platform 36 installed.

## Important source-code note

The full game engine is currently checked in as a compiled JavaScript bundle,
not as its original editable module tree. Its minified internals have not been
split into artificial files because that can break shared scope, gameplay, or
the Android-specific build. See [the architecture notes](docs/ARCHITECTURE.md)
before editing or replacing the engine bundle.
