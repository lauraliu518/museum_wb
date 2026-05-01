import { locations } from "./assets/data/locations.js";
import { artifacts } from "./assets/data/artifacts.js";

//location to start with
let current = "H";
let skyEl, hotspotContainer, fadeEl;

//cache textures
const textureCache = {};


export function initWorld(root) {
    //remove old scenes to prevent duplicate
    root.innerHTML = "";

    //fade overlay
    fadeEl = document.createElement("div");
    fadeEl.className = "fade";

    //A Frame scene set up
    const scene = document.createElement("a-scene");
    //sky
    skyEl = document.createElement("a-sky");
    //camera
    const camera = document.createElement("a-entity");
    camera.setAttribute("camera", "");
    camera.setAttribute("look-controls", ""); //mouse to look around
    camera.setAttribute("wasd-controls", "enabled: false"); //diable movement in space

    const cursor = document.createElement("a-entity");
    cursor.setAttribute("cursor", {rayOrigin: "mouse"});
    cursor.setAttribute("visible", false);
    cursor.setAttribute("raycaster", "objects: .clickable"); //only hit clickable class
    camera.appendChild(cursor); //follows user view

    //container for navigation disks and artifacts
    hotspotContainer = document.createElement("a-entity");

    scene.appendChild(skyEl);
    scene.appendChild(camera);
    scene.appendChild(hotspotContainer);

    root.appendChild(fadeEl);
    root.appendChild(scene);

    //preload current image, and preload linked images in current location
    preloadImage(current);
    preloadNeighbors(locations[current]);

    renderLocation();
}

export function setCurrentLocation(next) {
    if (!locations[next]) return;
    current = next;

    if (skyEl && hotspotContainer) {
        renderLocation();
    }
}

//Render each location
function renderLocation() {
    //test performance
    const start = performance.now();

    const loc = locations[current];

    //use cached img
    const img = textureCache[current];
    //fast swap
    if (img) {
        skyEl.setAttribute("src", img.src);
    } else {
        //add img to cache
        skyEl.setAttribute("src", loc.imageSrc);
        preloadImage(current);
    }
    const end = performance.now();
    console.log("render time:", (end - start).toFixed(2), "ms");

    // preload next possible rooms
    preloadNeighbors(loc);

    //clear older objects
    hotspotContainer.innerHTML = "";

    //navigation disks
    function handleDiskClick(e) {
        const target = e.currentTarget.dataset.target;
        console.log("clicked location disk:", e.currentTarget.dataset.target);
        changeLocation(target);
    }
    //render all navigation disks
    for (const link of loc.links){
        const disk = document.createElement("a-ring");
        const hitArea = document.createElement("a-circle");

        disk.setAttribute("position", link.position);
        disk.setAttribute("rotation", "-90 0 0"); //"flat on the ground"
        // museum-minimal wayfinding ring
        disk.setAttribute("radius-inner", "0.24");
        disk.setAttribute("radius-outer", "0.3");
        disk.setAttribute("color", "#d9d9d9");
        disk.setAttribute("opacity", "0.5");
        disk.setAttribute("material", "shader: flat; side: double");
        disk.setAttribute("scale", "1 1 1");

        // invisible filled circle for easier hit detection
        hitArea.setAttribute("position", link.position);
        hitArea.setAttribute("rotation", "-90 0 0");
        hitArea.setAttribute("radius", "0.34");
        hitArea.setAttribute("material", "opacity: 0; transparent: true; side: double");

        hitArea.classList.add("clickable");
        hitArea.dataset.target = link.target;
        hitArea.addEventListener("click", handleDiskClick);
        hitArea.addEventListener("mouseenter", () => {
            disk.setAttribute("color", "#8900e1");
            disk.setAttribute("opacity", "0.85");
            disk.setAttribute("scale", "1.08 1.08 1.08");
        });
        hitArea.addEventListener("mouseleave", () => {
            disk.setAttribute("color", "#d9d9d9");
            disk.setAttribute("opacity", "0.5");
            disk.setAttribute("scale", "1 1 1");
        });

        hotspotContainer.appendChild(disk);
        hotspotContainer.appendChild(hitArea);
    }

    //artifacts
    function handleArtifactClick(e) {
        const art = JSON.parse(e.currentTarget.dataset.art);
        console.log("clicked artifact hotspot:", e.currentTarget.dataset.art);
        showArtifact(art);
    }
    if (loc.artifacts) {
        for (const artInstance of loc.artifacts) {
            //merge artifact content with position
            const fullArt = {
                ...artifacts[artInstance.id], //content
                ...artInstance //position, rotation
            };
    
            const tag = document.createElement("a-sphere");
    
            tag.setAttribute("position", artInstance.position);
            tag.setAttribute("rotation", artInstance.rotation || "0 0 0");
    
            tag.setAttribute("radius", "0.14");
            tag.setAttribute("color", "#ffffff");
            tag.setAttribute("opacity", "0.45");
            tag.setAttribute("material", "shader: flat; transparent: true");
    
            tag.classList.add("clickable");
    
            tag.dataset.art = JSON.stringify(fullArt);
    
            tag.addEventListener("click", handleArtifactClick);
    
            tag.addEventListener("mouseenter", () => {
                tag.setAttribute("scale", "1.2 1.2 1.2");
                tag.setAttribute("opacity", "0.8");
                tag.setAttribute("material", "shader: flat; transparent: true");
            });
    
            tag.addEventListener("mouseleave", () => {
                tag.setAttribute("scale", "1 1 1");
                tag.setAttribute("opacity", "0.45");
                tag.setAttribute("material", "shader: flat; transparent: true");
            });
    
            hotspotContainer.appendChild(tag);
        }
    }
}

//preload imagefunction, takes location key as cache key
function preloadImage(key) {
    if (textureCache[key]) return;

    const img = new Image();
    img.src = locations[key].imageSrc;

    textureCache[key] = img;
}

//load all images of locations current location can lead to
function preloadNeighbors(loc) {
    if (!loc.links) return;//current loc has no neighbour

    for (const link of loc.links) {
        preloadImage(link.target);
    }
}

//Handle when clicked on new navigation disk
function changeLocation(next) {
    //start fade to black
    fadeEl.style.transition = "opacity 0.4s ease";
    fadeEl.style.opacity = 1;

    
    //listen to transition to finish
    fadeEl.addEventListener("transitionend", function handleFade() {
        fadeEl.removeEventListener("transitionend", handleFade);

        current = next;
        renderLocation();

        //reset fade element
        fadeEl.style.opacity = 0;
    });
}

//Handle when clicked on artifact hotspot, show information
function showArtifact(art) {
    //always grab newest language setting
    const lang = localStorage.getItem("lang") || "en";

    let closeBtnText = "Close";
    if(lang == "es"){
        closeBtnText = "Cerrar";
    }

    let panel = document.getElementById("artifact-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "artifact-panel";
        document.body.appendChild(panel);
    }

    panel.innerHTML = `
        <h3>${art.title[lang]}</h3>
        <p>${art.artist}, ${art.year}</p>
        <p>${art.body[lang]}</p>
        <button id="closeArtifact" onclick="document.getElementById('artifact-panel').remove()">${closeBtnText}</button>
    `;
}