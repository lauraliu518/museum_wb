import {initWorld, setCurrentLocation} from "./world.js";

const root = document.getElementById("app");

//Global settings
const settings = {
    colorMute: 0 // 0–100
};

//temp UI state
let pendingSettings = {
    colorMute: 0
};

let currentAlpha = 0;
let needsUpdate = true;
let selectedFloor = "floor6";

const floorMap = {
    floor6: "H",
    floor8: "Q",
    balcony: "L"
};

//cursor
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* START PAGE */
function showStartPage() {
    root.innerHTML = `
    <div class="page start-page">
        <div class="center">
            <h1>Whitney Biennial VR</h1>
            <button id="startBtn" class="btn-outline">Start Exploring</button>
        </div>
    </div>
    `;
    document.getElementById("startBtn").onclick = showSettingsPage;
}

/* SETTINGS PAGE */
function showSettingsPage() {
    root.innerHTML = `
    <div class="page settings-page">
        <div class="center">
            <h1>Settings</h2>

            <label>Color Muting</label>
            <input type="range" min="0" max="100" value="0" id="colorSlider"/>

            <p class="note">Adjust before entering experience</p>

            <button id="enterBtn">Enter Experience</button>
        </div>
    </div>
    `;
    const slider = document.getElementById("colorSlider");
    const enterBtn = document.getElementById("enterBtn");
    console.log("[SETTINGS PAGE] Loaded");

    //track slider movement (pending)
    slider.oninput = () => {
        pendingSettings.colorMute = Number(slider.value);
        console.log("[SETTINGS PAGE] Slider moved, pendingSettings:", pendingSettings);
    };

    //apply only on enter
    enterBtn.onclick = () => {
        settings.colorMute = pendingSettings.colorMute;
        needsUpdate = true;

        console.log("[SETTINGS PAGE] Apply settings:", settings);

        startExperience();
    };
}

/* VR EXPERIENCE PAGE */
function startExperience() {
    root.innerHTML = `
    <div class="page vr-page">
        <div id="vr-root"></div>

        <div id="hud-controls">
            <div id="hud" class="hud-collapsed">
                <div id="hud-toggle">Settings</div>

                <div id="hud-panel" class="hidden">
                    <h3>Settings</h3>

                    <label>Color Muting</label>
                    <input type="range" min="0" max="100" value="0" id="hudColorSlider"/>

                    <button id="saveSettings">Save</button>
                </div>
            </div>

            <div id="hud-floors" class="hud-collapsed">
                <div id="hud-floors-toggle">Floors</div>

                <div id="hud-floors-panel" class="hidden">
                    <h3>Floors</h3>
                    <button class="floor-option selected" data-floor="floor6">Floor 6</button>
                    <button class="floor-option" data-floor="floor8">Floor 8</button>
                    <button class="floor-option" data-floor="balcony">Balcony</button>
                </div>
            </div>
        </div>

        <div id="hud-overlay" class="overlay"></div>
    </div>
    `;
    initWorld(document.getElementById("vr-root"));
    initP5Overlay(settings);
    initHUD();
}

/* PAGE HELPERS */
//p5 overlay
function initP5Overlay(settings) {
    console.log("[P5] Initializing overlay with settings:", settings);
    const sketch = (p) => {
        p.setup = function () {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.position(0, 0);
            canvas.style("pointer-events", "none");
            canvas.style("position", "fixed");
            canvas.style("top", "0");
            canvas.style("left", "0");
            canvas.style("width", "100vw");
            canvas.style("height", "100vh");
            canvas.style("z-index", "999"); 
            canvas.style("pointer-events", "none");
            
        };

        p.draw = function () {
            if (needsUpdate) {
                currentAlpha = p.map(settings.colorMute, 0, 100, 0, 180);
                needsUpdate = false;
        
                console.log("[P5] Recomputed alpha:", currentAlpha);
            }

            p.clear();
            p.fill(200, 200, 200, currentAlpha);
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
    const floorsHud = document.getElementById("hud-floors");
    const floorsToggle = document.getElementById("hud-floors-toggle");
    const floorsPanel = document.getElementById("hud-floors-panel");
    const overlay = document.getElementById("hud-overlay");
    const saveBtn = document.getElementById("saveSettings");
    const hudSlider = document.getElementById("hudColorSlider");
    const floorOptions = document.querySelectorAll(".floor-option");

    //initialize slider match current settings
    hudSlider.value = settings.colorMute;

    //only update pending 
    hudSlider.oninput = () => {
        pendingSettings.colorMute = Number(hudSlider.value);
        console.log("[HUD] Pending Settings:", pendingSettings);
    };

    //spotlight hud
    const updateSpotlight = (targetPanel) => {
        const rect = targetPanel.getBoundingClientRect();
      
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
      
        overlay.style.setProperty("--spot-x", x + "px");
        overlay.style.setProperty("--spot-y", y + "px");
    };

    //initial state
    let expanded = false;
    let floorsExpanded = false;
    panel.classList.add("hidden");
    floorsPanel.classList.add("hidden");
    overlay.style.opacity = 0;
    overlay.classList.remove("active");
    hud.classList.remove("hud-expanded");
    hud.classList.add("hud-collapsed");
    floorsHud.classList.remove("hud-expanded");
    floorsHud.classList.add("hud-collapsed");

    const closeSettingsPanel = () => {
        expanded = false;
        panel.classList.add("hidden");
        hud.classList.remove("hud-expanded");
        hud.classList.add("hud-collapsed");
    };

    const closeFloorsPanel = () => {
        floorsExpanded = false;
        floorsPanel.classList.add("hidden");
        floorsHud.classList.remove("hud-expanded");
        floorsHud.classList.add("hud-collapsed");
    };

    const closeAllPanels = () => {
        closeSettingsPanel();
        closeFloorsPanel();
        overlay.style.opacity = 0;
        overlay.classList.remove("active");
        disableVRInteraction(false);
    };

    //toggle setting bar open/close
    toggle.onclick = () => {
        if (expanded) return; //if opened, ignore

        closeFloorsPanel();
        expanded = true; //set open
        console.log("[HUD] Opened");
        //show hud
        panel.classList.remove("hidden");
        hud.classList.add("hud-expanded");
        hud.classList.remove("hud-collapsed");
        overlay.style.opacity = 0.3;
        overlay.classList.add("active");
        //add spotlight effect
        updateSpotlight(panel);
        //disable interactions
        disableVRInteraction(true);
    };

    floorsToggle.onclick = () => {
        if (floorsExpanded) return;

        closeSettingsPanel();
        floorsExpanded = true;
        console.log("[HUD] Floors opened");
        floorsPanel.classList.remove("hidden");
        floorsHud.classList.add("hud-expanded");
        floorsHud.classList.remove("hud-collapsed");
        overlay.style.opacity = 0.3;
        overlay.classList.add("active");
        updateSpotlight(floorsPanel);
        disableVRInteraction(true);
    };

    const updateSelectedFloorUI = () => {
        floorOptions.forEach((option) => {
            option.classList.toggle("selected", option.dataset.floor === selectedFloor);
        });
    };

    floorOptions.forEach((option) => {
        option.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();

            selectedFloor = option.dataset.floor;
            updateSelectedFloorUI();

            const targetLocation = floorMap[selectedFloor];
            setCurrentLocation(targetLocation);
            closeAllPanels();
        };
    });

    updateSelectedFloorUI();

    //save settings
    saveBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //apply settings
        settings.colorMute = pendingSettings.colorMute;
        needsUpdate = true;
        console.log("[HUD] Settings applied:", settings);
        //close hud:
        closeAllPanels();
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