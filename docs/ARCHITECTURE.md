# Architecture and editing guide

## Runtime layers

- **Web application:** `public/index.html` is served by `server.js`. Generated CSS, compiled JavaScript, icons, manifest, and service worker are served from `public/`.
- **Static-host entry:** root `index.html` is a separate entry point because its asset paths differ from the Express-served page.
- **Editable styles:** `src/styles/00-core.css`, `10-visual-redesign.css`, `20-table-ratio.css`, `30-minimal-hud.css`, and `40-asset-free.css` are concatenated in numeric order by `npm run build`. The single generated stylesheet is synced to both web and Android runtime locations.
- **Editable PWA installer:** `src/pwa/install.js` is copied into the web runtime. Android HTML intentionally omits the install banner.
- **Game engine:** `public/js/pen-game.bundle.js` and `android/app/src/main/assets/www/js/pen-game.bundle.js` are compiled, platform-specific artifacts. Do not overwrite the Android artifact with the web version; invite-link behavior differs.
- **Android wrapper:** `android/app/src/main/java/` contains native WebView integration. `android/app/src/main/assets/www/` contains the offline web payload packaged with the application.
- **Automation:** `.github/workflows/` contains CI and Android debug APK build workflows.

## Change workflow

1. Edit the relevant numbered CSS module in `src/styles/`; keep the existing numeric prefixes and cascade order.
2. Edit browser install behavior in `src/pwa/install.js`.
3. Run `npm run build` to regenerate the runtime stylesheet and sync shared assets.
4. Run `npm test` before committing.
5. For game rules, 3D rendering, physics, controls, HUD UI or multiplayer, recover the original game source modules before refactoring the compiled engine bundle.
6. Test both web and Android builds. The Android bundle and HTML intentionally have platform differences.

## Future game-engine source layout

When the original editable source becomes available, organize it by responsibility rather than arbitrary line ranges:

- `src/game/app/` — application bootstrap and lifecycle
- `src/game/scene/` — Three.js renderer, bench, pens, lighting and cameras
- `src/game/physics/` — turn simulation, collisions and flick forces
- `src/game/input/` — mouse/touch controls and aiming
- `src/game/ui/` — setup, HUD, menus and dialogs
- `src/game/multiplayer/` — room state and online synchronization
- `src/game/audio/` — effects and haptic feedback

This is a target layout, not a claim that those source modules already exist. The current bundle should remain unchanged until the original source can be migrated and verified.
