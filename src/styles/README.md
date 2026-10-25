# Stylesheet modules

The stylesheet is split into ordered, responsibility-focused modules. Keep the numeric prefix because the modules are concatenated in this order during the build.

| File | Responsibility |
| --- | --- |
| `00-core.css` | Theme tokens, base controls, gameplay HUD and shared components |
| `10-visual-redesign.css` | Visual redesign overrides and surfaces |
| `20-table-ratio.css` | 2D table sizing and centering rules |
| `30-minimal-hud.css` | Compact transparent HUD layout and controls |
| `40-asset-free.css` | Asset-free UI adjustments |

Edit these source files, then run `npm run build`. The build concatenates them into a single `public/css/game.css` and syncs the same CSS to Android's packaged web assets. This preserves rule order and avoids extra stylesheet requests at runtime.

Do not edit the generated runtime CSS files directly; the next build will overwrite them.
