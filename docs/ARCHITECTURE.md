# Architecture and editing guide

## Runtime layers

- **Web application:** `public/index.html` is served by `server.js`. CSS, JavaScript, icons, manifest, and service worker are served from `public/`.
- **Static-host entry:** root `index.html` is a separate entry point because its asset paths differ from the Express-served page.
- **Editable shared sources:** `src/styles/game.css` and `src/pwa/install.js` are the sources of truth for the stylesheet and PWA installer. `npm run build` copies them to the web runtime, and copies the stylesheet to Android's packaged assets.
- **Game engine:** `public/js/pen-game.bundle.js` and `android/app/src/main/assets/www/js/pen-game.bundle.js` are compiled, platform-specific artifacts. Do not overwrite the Android artifact with the web version as a blind copy; invite-link behavior differs.
- **Android wrapper:** `android/app/src/main/java/` contains native WebView integration. `android/app/src/main/assets/www/` contains the offline web payload packaged with the application.
- **Automation:** `.github/workflows/` contains CI and the Android debug APK build workflow.

## Change workflow

1. Edit shared styles only in `src/styles/game.css`.
2. Edit the browser install banner behavior only in `src/pwa/install.js`.
3. Run `npm run build` to sync runtime copies and validate paths.
4. Run `npm test` before committing.
5. For changes to game rules, 3D rendering, physics, controls, UI, or multiplayer, first recover the original game source modules. The repository currently contains only the compiled engine bundle, so changing minified internals is difficult to review and risky.
6. Test both web and Android. The Android bundle and HTML deliberately have platform differences.

## Target module layout for a future engine-source migration

When the original source becomes available, organize the game engine along responsibility boundaries instead of splitting arbitrary line ranges:

- `src/game/app/` — application bootstrap and lifecycle
- `src/game/scene/` — Three.js renderer, bench, pens, lighting, cameras
- `src/game/physics/` — turn simulation, collisions, flick forces
- `src/game/input/` — mouse/touch controls and aiming
- `src/game/ui/` — setup, HUD, menus, dialogs
- `src/game/multiplayer/` — room state and online synchronization
- `src/game/audio/` — effects and haptic feedback

This future layout is intentionally a plan, not fake source modules. Keep the current known-good bundle intact until the original source can be migrated and verified.
