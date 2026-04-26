// ===== CONFIG =====
const images = [
  "gallery1_1.jpg",
  "gallery1_2.jpg",
  "gallery1_3.jpg",
  "gallery1_4.jpg",
  "gallery1_5.jpg",
  "gallery1_6.jpg",
  "gallery1_7.jpg",
  "gallery1_8.jpg",
  "gallery1_9.jpg",
  "gallery1_10.jpg",
  "gallery2_1.jpg",
  "gallery2_2.jpg",
  "gallery2_3.jpg",
  "gallery2_4.jpg",
  "gallery3_1.jpg",
  "gallery3_2.jpg",
  "gallery3_3.jpg",
  "gallery3_4.jpg",
  "gallery3_5.jpg",
  "gallery3_6.jpg",
  "gallery3_7.jpg",
  "gallery3_8.jpg",
  "gallery3_9.jpg",
  "gallery3_10.jpg",
  "gallery4_1.jpg",
  "gallery4_2.jpg",
  "gallery4_3.jpg",
  "gallery4_4.jpg",
  "gallery5_1.jpg",
  "gallery5_2.jpg",
  "gallery5_3.jpg",
  "gallery5_4.jpg",
  "gallery5_5.jpg",
  "gallery6_1.jpg",
  "gallery6_2.jpg",
  "repeated.jpg"
];

// location key mapping from src/assets/data/locations.js (image filename -> location key)
const locationKeyByImage = {
  "gallery1_1.jpg": "A",
  "gallery1_2.jpg": "B",
  "gallery1_3.jpg": "C",
  "gallery1_4.jpg": "D",
  "gallery1_5.jpg": "E",
  "gallery1_6.jpg": "F",
  "gallery1_7.jpg": "G",
  "gallery1_8.jpg": "H",
  "gallery1_9.jpg": "I",
  "gallery1_10.jpg": "J",
  "gallery2_1.jpg": "L",
  "gallery2_2.jpg": "M",
  "gallery2_3.jpg": "N",
  "gallery2_4.jpg": "O",
  "gallery3_1.jpg": "Q",
  "gallery3_2.jpg": "R",
  "gallery3_3.jpg": "S",
  "gallery3_4.jpg": "T",
  "gallery3_5.jpg": "U",
  "gallery3_6.jpg": "V",
  "gallery3_7.jpg": "W",
  "gallery3_8.jpg": "X",
  "gallery3_9.jpg": "Y",
  "gallery3_10.jpg": "Z",
  "gallery4_1.jpg": "AC",
  "gallery4_2.jpg": "AD",
  "gallery4_3.jpg": "AE",
  "gallery4_4.jpg": "AF",
  "gallery5_1.jpg": "AG",
  "gallery5_2.jpg": "AH",
  "gallery5_3.jpg": "AI",
  "gallery5_4.jpg": "AJ",
  "gallery6_1.jpg": "AL",
  "gallery6_2.jpg": "AM"
};
  
  let index = 0;
  
  // store placements per image
  const placements = {};
  
  // pending point (yellow)
  let pendingPoint = null;
  
  // drag detection
  let isDragging = false;
  
  
  // ===== UI OVERLAY =====
  const ui = document.createElement("div");
  ui.style.position = "fixed";
  ui.style.top = "10px";
  ui.style.left = "10px";
  ui.style.padding = "10px 14px";
  ui.style.background = "rgba(0,0,0,0.6)";
  ui.style.color = "white";
  ui.style.fontFamily = "monospace";
  ui.style.fontSize = "14px";
  ui.style.borderRadius = "8px";
  ui.style.zIndex = "9999";
  
  const imageLabel = document.createElement("div");
  const statusLabel = document.createElement("div");
  
  statusLabel.style.marginTop = "6px";
  statusLabel.style.opacity = "0.85";
  
  ui.appendChild(imageLabel);
  ui.appendChild(statusLabel);
  document.body.appendChild(ui);
  
  
  // ===== HELPERS =====
  function getCurrentImage() {
    return images[index];
  }

  function getCurrentLocationKey() {
    return locationKeyByImage[getCurrentImage()] || "N/A";
  }
  
  function updateImageLabel() {
    imageLabel.textContent = `Image: ${getCurrentImage()} | Key: ${getCurrentLocationKey()}`;
  }
  
  function showStatus(msg, color = "white") {
    statusLabel.textContent = msg;
    statusLabel.style.color = color;
  
    setTimeout(() => {
      statusLabel.textContent = "";
    }, 1200);
  }
  
  function clearMarkers() {
    document.querySelectorAll(".marker").forEach(el => el.remove());
    document.querySelectorAll(".preview").forEach(el => el.remove());
  }
  
  
  // ===== MARKERS =====
  
  // yellow preview (pending)
  function previewMarker(position) {
    document.querySelectorAll(".preview").forEach(el => el.remove());
  
    const marker = document.createElement("a-sphere");
    marker.setAttribute("position", position);
    marker.setAttribute("radius", "0.12");
    marker.setAttribute("color", "yellow");
    marker.classList.add("preview");
  
    document.querySelector("a-scene").appendChild(marker);
  }
  
  // red final (saved)
  function spawnMarker(position) {
    const marker = document.createElement("a-sphere");
    marker.setAttribute("position", position);
    marker.setAttribute("radius", "0.15");
    marker.setAttribute("color", "red");
    marker.classList.add("marker");
  
    document.querySelector("a-scene").appendChild(marker);
  }
  
  
  // ===== DRAG DETECTION =====
  window.addEventListener("mousedown", () => isDragging = false);
  window.addEventListener("mousemove", () => isDragging = true);
  
  
  // ===== CLICK → SET PENDING ONLY =====
  document.querySelector("a-scene").addEventListener("click", function (evt) {
    if (isDragging) return; // ignore drag clicks
  
    const point = evt.detail.intersection?.point;
    if (!point) return;
  
    const converted = convertCoords(point.x, point.y, point.z);

    // store as string 
    pendingPoint = `${converted.x} ${converted.y} ${converted.z}`;
  
    console.log("Pending point:", pendingPoint);
    showStatus("Point selected", "yellow");
  
    previewMarker(pendingPoint);
  });
  
  
  // ===== KEYBOARD CONTROLS =====
  window.addEventListener("keydown", (e) => {
  
    // SAVE (r)
    if (e.key === "r") {
      if (!pendingPoint) {
        showStatus("Click first to select a point", "orange");
        return;
      }
    
      const img = getCurrentImage();
    
      if (!placements[img]) placements[img] = [];
    
      placements[img].push(pendingPoint);
    
      
      const converted = convertCoords(pendingPoint);
    
      console.log(`Saved in ${img}:`, pendingPoint);
      console.log("Converted:", converted);
    
      showStatus("Point saved", "lightgreen");
    
      spawnMarker(pendingPoint);
    
      pendingPoint = null;
      document.querySelectorAll(".preview").forEach(el => el.remove());
    }
  
    // NEXT IMAGE (n)
    if (e.key === "n") {
      index = (index + 1) % images.length;
  
      document.querySelector("#sky").setAttribute(
        "src",
        `/src/assets/scene_assets/${images[index]}`
      );
  
      clearMarkers();
      updateImageLabel();
      showStatus("Next scene", "lightblue");
  
      console.log("Switched to:", images[index]);
      console.log("Location key:", getCurrentLocationKey());
    }
  
    // PREVIOUS IMAGE (p)
    if (e.key === "p") {
      index = (index - 1 + images.length) % images.length;
  
      document.querySelector("#sky").setAttribute(
        "src",
        `/src/assets/scene_assets/${images[index]}`
      );
  
      clearMarkers();
      updateImageLabel();
      showStatus("Previous scene", "lightblue");
  
      console.log("Switched to:", images[index]);
      console.log("Location key:", getCurrentLocationKey());
    }
  
    // EXPORT (e)
    if (e.key === "e") {
      console.log("=== EXPORT ===");
      console.log(JSON.stringify(placements, null, 2));
      console.log("=== IMAGE -> LOCATION KEY (from locations.js) ===");
      images.forEach((img) => {
        console.log(`${img}: ${locationKeyByImage[img] || "N/A"}`);
      });
  
      showStatus("Exported to console", "white");
    }
  
    // CLEAR CURRENT (c)
    if (e.key === "c") {
      const img = getCurrentImage();
      placements[img] = [];
  
      clearMarkers();
      showStatus("Cleared points", "orange");
    }
  
  });

  function convertCoords(x, y, z) {
    const scale = 0.01;
  
    return {
      x: +(x * scale).toFixed(2),
      y: +(y * scale).toFixed(2),
      z: +(z * scale).toFixed(2) // flip if needed
    };
  }

  
  
  // ===== INIT =====
  updateImageLabel();
console.log("Current location key:", getCurrentLocationKey());