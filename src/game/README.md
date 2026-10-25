# Game engine source status

The repository currently contains the production game engine as a compiled JavaScript bundle at `public/js/pen-game.bundle.js`, plus a platform-specific Android copy. The original editable React/Three.js source modules are not present in this branch.

Do not split the compiled bundle by byte ranges or arbitrary line boundaries. Bundled modules share lexical scope and initialization order, so a cosmetic split can break the game without producing maintainable source code.

When the original source is recovered, move game logic into the modules described in `docs/ARCHITECTURE.md`, add build tooling to generate both runtime bundles, and verify gameplay on web and Android before replacing the current artifacts.
