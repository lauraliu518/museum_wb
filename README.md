# Whitney Biennial VR (prototype)

**Overview:** Browser-based 360° “walkthrough” of exhibition spaces: panoramic skies, clickable hotspots to move between rooms, and simple artifact hotspots with label panels.

**A-Frame** builds the WebGL scene (sky sphere, camera with look controls, raycast click). **p5.js** sits on top as a transparent overlay (currently a light hardcoded tint—placeholder). 

**Design:**

- **`main.js` — UI shell and 2D layer.**  
  - **Page flow:** `showStartPage` -> `showSettingsPage` -> `startExperience` swap HTML inside `#app` (title screen, settings form, then the VR container `#vr-root` plus HUD markup).  
  - **After “Enter”:** calls `initWorld` from `world.js`, then `initP5Overlay` (full-screen p5 canvas, pointer-events off) and `initHUD` (expand/collapse settings bar, dimming overlay).  
  - **Input gating:** `disableVRInteraction` finds the A-Frame scene and toggles the camera cursor’s `raycaster` so when the HUD is open, clicks go to the 2D UI, not the 3D hotspots.

- **`world.js` — 3D scene and museum logic.**  
  - **`initWorld(root)`** clears `root`, builds the DOM for `a-scene`: `a-sky`, camera with `look-controls` (no WASD), child entity with `cursor` + `raycaster` limited to `.clickable`, and a container for hotspots.  
  - **`renderLocation()`** reads `locations[current]` from `locations.js`, applies the panorama to the sky (using the texture cache), spawns navigation disks (`a-circle`) and artifact boxes (`a-box`) with click handlers.  
  - **`changeLocation`** runs a CSS fade on a sibling overlay, then updates `current` (global variable) and re-renders. **`showArtifact`** injects a simple HTML panel for label text (will change later).  
  - **Helpers:** `preloadImage` / `preloadNeighbors` keep upcoming room textures ready, load current image to "cache" or load neighbouring room's textures.

**Data:** 
- `locations.js` is a small graph of rooms (`A`–`D`): each node has a panorama image, links to neighbors with 3D positions for navigation disks, and optional artifact metadata. 
- Images are **preloaded** (current room + linked rooms) and "cached" so sky swaps stay fast; **location changes** use a short CSS fade. Artifact clicks render a lightweight HTML panel.

**Status:** Settings sliders and some UI are placeholders; core navigation and hotspot wiring are in place.
