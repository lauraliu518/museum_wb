import {initWorld, setCurrentLocation} from "./world.js";

const UI_TEXT = {
    en: {
        title: "Whitney Biennial VR",
        start: "Start Exploring",
        settings:"Settings",
        cm_title:"Color Muting",
        cm_desc:"Adjust before entering experience",
        enter:"Enter Experience",
        flrs:"Floors",
        flr: "Floor",
        terrace:"Terrace",
        save: "Save",
        hud_lang_title: "Español" 
    },
    es: {
        title: "Whitney Biennial VR",
        start: "Comenzar a explorar",
        settings:"Ajustes",
        cm_title:"Preferencias de color",
        cm_desc:"Ajuste antes de entrar a la experiencia",
        enter:"Entrar",
        flrs:"Pisos",
        flr: "Piso",
        terrace:"Terraza",
        save: "Guardar",
        hud_lang_title: "English" 
    }
};

const root = document.getElementById("app");

//Global settings
const settings = {
    colorMute: 0, // 0–100
    language: localStorage.getItem("lang") || "en" //"en"/"es"
};

//temp UI state
let pendingSettings = {
    colorMute: 0,
    language: "en"
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
    const lang = settings.language;

    root.innerHTML = `
    <div class="page start-page">
        <div class="layout">    
            <button id="langBtn" class="lang-btn">EN/ES</button>
            <div class="center">
                <h1 id="start-title"></h1>
                <button id="startBtn" class="btn-outline"></button>
            </div>
        </div>
    </div>
    `;
    updateText();
    document.getElementById("startBtn").onclick = showSettingsPage;
    document.getElementById("langBtn").onclick = () => {
        let newLang;
        if(settings.language === "en"){
            newLang = "es";
        }else{
            newLang = "en";
        }

        //update both states
        settings.language = newLang;
        pendingSettings.language = newLang;

        //update localstorage to allow world.js access
        localStorage.setItem("lang", settings.language);

        //re-render 
        updateText();
    };
}

/* SETTINGS PAGE */
function showSettingsPage() {
    const lang = settings.language;
    root.innerHTML = `
    <div class="page settings-page">
        <div class="layout">
            <button id="langBtn" class="lang-btn">EN/ES</button>
            <div class="center">
                <h1 class="title" id="settings-title"></h1>
                <div class="settings-page-color-muting">
                    <label id="cm-title"></label>
                    <input type="range" min="0" max="100" value="0" id="colorSlider"/>
                </div>
                <p class="note" id="cm-desc"></p>

                <button id="enterBtn"></button>
            </div>
        </div>
    </div>
    `;
    updateText();
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

    //language switch
    document.getElementById("langBtn").onclick = () => {
        let newLang;
        if(settings.language === "en"){
            newLang = "es";
        }else{
            newLang = "en";
        }

        //update both states
        settings.language = newLang;
        pendingSettings.language = newLang;

        localStorage.setItem("lang", settings.language);

        console.log("[LANGUAGE] Switched to:", newLang);

        //re-render 
        updateText();
    };
}

/* VR EXPERIENCE PAGE */
function startExperience() {
    const lang = settings.language;
    root.innerHTML = `
    <div class="page vr-page">
        <div id="vr-root"></div>

        <div id="hud-controls">
            <div id="hud" class="hud-collapsed">
                <div id="hud-toggle"></div>

                <div id="hud-panel" class="hidden">
                    <h3 id="hud-settings-title"></h3>
                    <label id="hud-cm-title"></label>

                    <input type="range" min="0" max="100" value="0" id="hudColorSlider"/>

                    <label id="hud-lang-title"></label>

                    <button id="saveSettings"></button>
                </div>
            </div>

            <div id="hud-floors" class="hud-collapsed">
                <div id="hud-floors-toggle"></div>

                <div id="hud-floors-panel" class="hidden">
                    <h3 id="hud-floors-title"></h3>
                    <button class="floor-option selected" data-floor="floor6"></button>
                    <button class="floor-option" data-floor="floor8"></button>
                    <button class="floor-option" data-floor="balcony"></button>
                </div>
            </div>
        </div>

        <div id="hud-overlay" class="overlay"></div>
    </div>
    `;
    updateText();
    initWorld(document.getElementById("vr-root"));
    initP5Overlay(settings);
    initHUD();
    document.getElementById("hud-lang-title").onclick = () => {
        let newLang;
        if(settings.language === "en"){
            newLang = "es";
        }else{
            newLang = "en";
        }

        //update both states
        settings.language = newLang;
        pendingSettings.language = newLang;

        localStorage.setItem("lang", settings.language);

        console.log("[LANGUAGE] Switched to:", newLang);

        //re-render 
        updateText();
    };
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
            console.log(option.dataset.floor);
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

//update text content, avoid rerender whole structure
function updateText() {
    const lang = settings.language;

    //start page
    if (document.getElementById("start-title")) {
        document.getElementById("start-title").textContent = UI_TEXT[lang].title;
        document.getElementById("startBtn").textContent = UI_TEXT[lang].start;
    }

    //settings
    if (document.getElementById("settings-title")) {
        document.getElementById("settings-title").textContent = UI_TEXT[lang].settings;
        document.getElementById("cm-title").textContent = UI_TEXT[lang].cm_title;
        document.getElementById("cm-desc").textContent = UI_TEXT[lang].cm_desc;
        document.getElementById("enterBtn").textContent = UI_TEXT[lang].enter;
    }

    //hud section
    if (document.getElementById("hud-toggle")) {
        document.getElementById("hud-toggle").textContent = UI_TEXT[lang].settings;
        document.getElementById("hud-settings-title").textContent = UI_TEXT[lang].settings;
        document.getElementById("hud-cm-title").textContent = UI_TEXT[lang].cm_title;
        document.getElementById("hud-lang-title").textContent = UI_TEXT[lang].hud_lang_title;
        document.getElementById("saveSettings").textContent = UI_TEXT[lang].save;

        document.getElementById("hud-floors-toggle").textContent = UI_TEXT[lang].flrs;
        document.getElementById("hud-floors-title").textContent = UI_TEXT[lang].flrs;

        const floorBtns = document.querySelectorAll(".floor-option");
        if (floorBtns.length === 3) {
            floorBtns[0].textContent = `${UI_TEXT[lang].flr} 6`;
            floorBtns[1].textContent = `${UI_TEXT[lang].flr} 8`;
            floorBtns[2].textContent = UI_TEXT[lang].terrace;
        }
    }
}

//init
showStartPage();