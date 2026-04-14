import {initWorld} from "./world.js";

const root = document.getElementById("app");

/* START PAGE */

function showStartPage() {
    root.innerHTML = `
    <div class="center">
        <h1>Whitney Biennial VR</h1>
        <button id="startBtn">Start Exploring</button>
    </div>
    `;
    document.getElementById("startBtn").onclick = showSettingsPage;
}

/* SETTINGS PAGE */

function showSettingsPage() {
    root.innerHTML = `
    <div class="center">
        <h2>Settings</h2>

        <label>Color Muting</label>
        <input type="range" min="0" max="100" value="0" id="colorSlider"/>

        <p class="note">(Placeholder — not wired yet)</p>

        <button id="enterBtn">Enter Experience</button>
    </div>
    `;
    document.getElementById("enterBtn").onclick = startExperience;
}

/* VR EXPERIENCE PAGE */
function startExperience() {
    root.innerHTML = `
    <div id="vr-root"></div>

    <div id="hud" class="hud-collapsed">
        <div id="hud-toggle">Settings</div>

        <div id="hud-panel" class="hidden">
        <h3>Settings</h3>

        <label>Color Muting</label>
        <input type="range" min="0" max="100" value="0" id="hudColorSlider"/>

        <button id="saveSettings">Save</button>
        </div>
    </div>

    <div id="hud-overlay"></div>
    `;
    initWorld(document.getElementById("vr-root"));
    initP5Overlay();
    initHUD();
}

/* PAGE HELPERS */
//p5 overlay
function initP5Overlay() {
    const sketch = (p) => {
        p.setup = function () {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.position(0, 0);
            canvas.style("pointer-events", "none");
        };

        p.draw = function () {
            p.clear();
            p.fill(200, 200, 200, 20);
            p.rect(0, 0, p.width, p.height);
        };
    };

    new p5(sketch);
}

//HUD setup
function initHUD() {
    const hud = document.getElementById("hud");
    const toggle = document.getElementById("hud-toggle");
    const panel = document.getElementById("hud-panel");
    const overlay = document.getElementById("hud-overlay");
    const saveBtn = document.getElementById("saveSettings");

    //initial state
    let expanded = false;
    panel.classList.add("hidden");
    overlay.style.opacity = 0;
    overlay.classList.remove("active");
    hud.classList.remove("hud-expanded");
    hud.classList.add("hud-collapsed");

    //toggle setting bar open/close
    toggle.onclick = () => {
        //toggle boolean
        expanded = !expanded;

        if (expanded) {
            //show settings bar details
            panel.classList.remove("hidden");
            hud.classList.add("hud-expanded");
            hud.classList.remove("hud-collapsed");
            overlay.style.opacity = 0.3;
            overlay.classList.add("active");

            //diable user interaction in background
            disableVRInteraction(true);

        } else {
            //hide settings bar details
            panel.classList.add("hidden");
            hud.classList.remove("hud-expanded");
            hud.classList.add("hud-collapsed");
            overlay.style.opacity = 0;
            overlay.classList.remove("active");

            //allow user interaction again
            disableVRInteraction(false);
        }
    };

    //save settings
    saveBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //TODO: save settings
        console.log("Settings saved (placeholder)");
    };
}

//disable interaction when HUD is open
function disableVRInteraction(disabled) {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const cursor = scene.querySelector("[cursor]");
    if (!cursor) return;

    if (disabled) {
        cursor.setAttribute("raycaster", { objects: "none" });
    } else {
        cursor.setAttribute("raycaster", { objects: ".clickable" });
    }
}

//init
showStartPage();