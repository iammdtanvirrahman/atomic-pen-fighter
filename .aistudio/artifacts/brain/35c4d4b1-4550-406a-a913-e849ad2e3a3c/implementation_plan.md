# Optimization & Performance Overhaul for Android & PC (Pen Game)

Comprehensive performance tuning and control overhaul to eliminate lag on Android and PC, ensuring a fluid 60 FPS gameplay experience with responsive slingshot physics and tactile haptic feedback.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Visual Engine Priority**: Optimized 3D mode across all devices with smooth performance tuning.
> - **Touch & Input Mechanics**: Responsive slingshot drag equipped with predictive trajectory aiming and multi-tiered haptic feedback.
> - **Performance Architecture**: Removal of all compositor-stalling `backdrop-filter` blurs, capping device pixel ratio (DPR), and implementing 60 FPS frame budgeting.

- **Confirmed Decision 1**: Prioritize optimized 3D graphics with intelligent hardware-adaptive scaling (capping mobile DPR at $\le 1.35$ and PC at $\le 1.75$) instead of rendering at raw native device pixel ratio (which causes severe fill-rate bottlenecks on 1080p/1440p mobile screens).
- **Confirmed Decision 2**: Eliminate all CSS `backdrop-filter: blur(...)` rules across all HUD, overlays, and dialogs. Replace with GPU-friendly translucent obsidian gradients (`rgba(11, 13, 32, 0.94)`) to prevent compositor readback stalls.
- **Confirmed Decision 3**: Upgrade touch interaction with isolated `touch-action: none` canvas containment, tactile haptic feedback during slingshot pull, release snap, and collision impacts, and enhanced trajectory rendering.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the Bangladeshi school-bench pen fighter game (`Pen Game 6.0 (কলম খেলবি?)`) into an ultra-smooth, responsive 60 FPS experience on mobile (Android) and desktop (PC).
- **Target Audience**: Mobile players on Android phones and tablets, as well as desktop browser users, who want instant tactile feedback, zero input latency, and lag-free 3D physics.
- **Key Value**: Eradicates stuttering, frame drops, and touch gesture conflicts, delivering fluid slingshot mechanics and seamless 3D bench visuals.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title / Setup Screen**: Smooth, instant launch with zero layout shifts and lag-free UI transitions.
2. **Match Initiation**: Instant 3D bench render at capped native resolution, with soft lighting and grounded contact shadows.
3. **Slingshot Drag & Aim**:
   - Touchdown on player's pen locks pointer immediately (`touch-action: none`).
   - Pulling back draws a high-visibility trajectory arrow and dashed guide with power-scaled color (`green` $\to$ `yellow` $\to$ `crimson`).
   - Tactile haptic ticks fire as power passes 25%, 50%, 75%, and 100%.
4. **Flick & Physics**:
   - Releasing the flick triggers a crisp haptic snap (`15ms`).
   - Physics updates at fixed 60 Hz with delta clamping (`Math.min(dt, 0.05)`).
   - Pen impacts produce satisfying procedural audio and collision haptics (`25–35ms`).

### Visual Identity & Layout
- **Atmospheric Obsidian Theme**: Deep slate canvas (`#08090d` / `#0a0b14`), warm wood bench textures, vibrant pen body accents (royal blue, crimson red, emerald green, sunflower gold).
- **Low-Occlusion HUD**: Perimeter turn badge and timer clock with clean tabular numerals (`font-variant-numeric: tabular-nums`). No visual clutter obstructing the desk.
- **Solid High-Performance Surfaces**: Fast GPU-rendered translucent layers (`#0b0d20fa`) with hairline borders (`rgba(255, 255, 255, 0.12)`) replacing expensive blur filters.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Device Pixel Ratio Capping**
  - *Chosen Approach*: Clamp DPR on mobile/touch to `Math.min(window.devicePixelRatio, 1.35)` and desktop to `Math.min(window.devicePixelRatio, 1.75)` (or 1.0 on software/low-end GPUs).
  - *Why*: On phones with $3\times$ DPR, rendering Three.js at full native resolution renders over $7 \text{ million pixels}$ per frame, destroying mobile GPUs. Clamping saves $>60\%$ fill-rate cost with negligible visual difference.
  - *Alternatives Considered*: Dynamic resolution scaling with blur upsampling was evaluated, but a clean fixed clamp is sharper and maintains consistent frame times.

- **Decision 2: Elimination of Compositor Backdrop Blurs**
  - *Chosen Approach*: Remove all `backdrop-filter: blur(...)` and `-webkit-backdrop-filter: blur(...)` declarations from CSS, replacing them with dark semi-opaque surfaces.
  - *Why*: In Chrome on Android, `backdrop-filter` over an active WebGL canvas causes severe frame drops down to 15–20 FPS because the browser must read back the WebGL framebuffer to CPU memory on every frame.
  - *Alternatives Considered*: Disabling blur only on mobile was considered, but desktop also gains ~5ms per frame overhead reduction.

- **Decision 3: Shadow Map Optimization**
  - *Chosen Approach*: Reduce directional shadow map from 4096 to 1024 on mobile and 2048 on PC, with `PCFSoftShadowMap` and tight orthographic frustum.
  - *Why*: A 4096 shadow map requires 64 MB of VRAM bandwidth every frame; 1024/2048 offers crisp pen shadows with vastly superior frametimes.

- **Decision 4: Multi-Stage Haptics & Input Isolation**
  - *Chosen Approach*: Implement Web Vibration API (`navigator.vibrate`) with settings check (`pg.settings.vib !== 0`), triggering on power milestones, flick release, and pen collisions. Ensure `touch-action: none` on `#stage` and canvas.

---

## 4. Technical Architecture & Data Strategy

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser Viewport                        │
│                                                              │
│  ┌─────────────────────── DOM HUD ────────────────────────┐  │
│  │  Turn Pill (Tabular)  ·  Clock Timer  ·  View Switcher │  │
│  │  (Zero backdrop-filter, GPU composite-friendly)        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────── Stage Container ───────────────────┐  │
│  │  touch-action: none (Zero gesture lag, no bounce)      │  │
│  │                                                        │  │
│  │  ┌─────────────── Three.js 3D Viewport ─────────────┐  │  │
│  │  │  - WebGLRenderer (Capped DPR 1.35 mobile / 1.75) │  │  │
│  │  │  - 1024/2048 PCFSoftShadowMap                    │  │  │
│  │  │  - Trajectory Aim Guide (Arrow + Assist Dash)    │  │  │
│  │  │  - Procedural 3D Pens & Wooden Desk PBR Group    │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────── Physics & Interaction Engine (60 FPS) ───────┐  │
│  │  - Fixed Delta Clamping: Math.min(rawDt, 0.05)         │  │
│  │  - Slingshot Drag Vector & Threshold Calculator        │  │
│  │  - Multi-tier Haptics Controller (Pull, Snap, Impact)  │  │
│  │  - Web Audio Synthesizer (Zero-latency hit sounds)     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

1. **Renderer Setup (`cP.init`)**:
   - Clamp `renderer.setPixelRatio`:
     `const maxDpr = navigator.maxTouchPoints > 0 ? 1.35 : 1.75;`
     `renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, maxDpr));`
   - Shadow map size: `1024` for mobile, `2048` for desktop.
   - Attach `webglcontextlost` and `webglcontextrestored` safety handlers.

2. **Style & CSS Normalization**:
   - Replace all `#top`, `#clk`, `#toast`, `#scr`, `.p`, `.setup-footer` `backdrop-filter: blur(...)` with solid dark translucent colors (`#0b0d20f2`).
   - Enforce `touch-action: none` and `user-select: none` on `#stage`, `canvas`, and game surfaces.

3. **Input & Haptics Dispatcher**:
   - Track drag power state: when drag length passes 25%, 50%, 75%, 100%, trigger subtle pulse (`navigator.vibrate(6)`).
   - On flick release: trigger crisp snap (`navigator.vibrate(18)`).
   - In Matter.js collision event handler: on pen-to-pen heavy impact, trigger punchy vibration (`navigator.vibrate(28)`).

4. **Synchronized Entry Points**:
   - Apply updates to `public/index.html` and root `index.html` identically.
   - Run verification via `compile_applet` and test server response.
