import { locations } from "./assets/data/locations.js";

//location to start with
let current = "A";
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
    cursor.setAttribute("cursor", {
        rayOrigin: "mouse",
        visible: false 
      });
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
        const disk = document.createElement("a-circle");

        disk.setAttribute("position", link.position);
        disk.setAttribute("rotation", "-90 0 0"); //"flat on the ground"
        //TODO: change disk design later
        disk.setAttribute("radius", "0.3");
        disk.setAttribute("color", "blue");

        disk.classList.add("clickable");
        disk.dataset.target = link.target;
        disk.addEventListener("click", handleDiskClick);
        hotspotContainer.appendChild(disk);
    }

    //artifacts
    function handleArtifactClick(e) {
        const art = JSON.parse(e.currentTarget.dataset.art);
        console.log("clicked artifact hotspot:", e.currentTarget.dataset.art);
        showArtifact(art);
    }
    if (loc.artifacts) {
        for (const art of loc.artifacts) {
            const box = document.createElement("a-box");
    
            box.setAttribute("position", art.position);
            box.setAttribute("rotation", art.rotation || "0 0 0");
            //TODO: artifact hotspot design
            box.setAttribute("color", "#8b6914");
    
            box.classList.add("clickable");
            box.dataset.art = JSON.stringify(art);
            box.addEventListener("click", handleArtifactClick);
            hotspotContainer.appendChild(box);
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
    let panel = document.getElementById("artifact-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "artifact-panel";
        document.body.appendChild(panel);
    }

    panel.innerHTML = `
        <h3>${art.title}</h3>
        <p>${art.artist}, ${art.year}</p>
        <p>${art.body}</p>
        <button id="closeArtifact" onclick="document.getElementById('artifact-panel').remove()">Close</button>
    `;
}