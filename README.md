# Echoes of the Black Tide (WebGL Adventure Prototype)

A modern, cinematic **third-person 3D adventure** scaffold for browser WebGL deployment using **Three.js**.

## Highlights
- Three.js rendering with physically based materials, soft shadows, fog, tone mapping, and cinematic lighting.
- Story-driven 6-level structure with progressive mystery reveal and collectible narrative fragments.
- Modular architecture:
  - `AssetLoader` for progressive loading and texture caching
  - `GameState` for health/stamina/story/alert states
  - `SceneManager` for renderer/camera/lighting lifecycle
  - `AIController` with patrol/chase/attack behavior loop
  - `PlayerController` with smooth movement + dynamic follow camera
- Keyboard & mouse controls + mobile virtual joystick/buttons.
- Dynamic adaptive soundtrack layers through WebAudio API.
- Lightweight immersive HUD.

## Controls
- `WASD`: move
- `Mouse`: rotate camera view
- `Shift`: sprint (drains stamina)
- `E`: interact / collect fragment
- `M`: enable dynamic audio engine (required by browser gesture policies)
- `N`: skip to next level

## Run
Because this app uses ES modules, run with a local server:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Performance / Web optimization notes
- Asset streaming is simulated through per-level loading packs and texture cache reuse.
- Mipmaps + anisotropy + repeat tiling improve quality/performance tradeoff.
- Dynamic world objects are disposed between levels to limit memory retention.
- Renderer pixel ratio is clamped for stable framerate on high-DPI devices.
- Mobile control overlay is conditionally enabled for touch devices.

## Folder layout
```
index.html
styles.css
src/
  main.js
  core/
    AssetLoader.js
    GameState.js
    SceneManager.js
  systems/
    AIController.js
    AudioSystem.js
    InputController.js
    LevelBuilder.js
    PlayerController.js
  ui/
    UIController.js
  data/
    levels.js
assets/
  textures/
  audio/
```

## Scope
This repository provides a production-style **playable framework and vertical-slice prototype**, intentionally modular so real character rigs, animation clips, authored levels, voice acting, and high-poly PBR assets can be integrated incrementally.
