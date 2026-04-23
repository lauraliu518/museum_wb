// ===== CONFIG =====
const images = [
    "gallery6_1.jpg",
    "gallery6_2.jpg",
    // "gallery6_3.jpg",
    // "gallery6_4.jpg",
    // "gallery6_5.jpg",
    // "gallery6_6.jpg",
    // "gallery6_7.jpg",
    // "gallery6_8.jpg",
    // "gallery6_9.jpg",
    // "gallery6_10.jpg",
    // "gallery6_11.jpg",
    // "gallery6_12.jpg"
  ];
  
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
  
  function updateImageLabel() {
    imageLabel.textContent = `Image: ${getCurrentImage()}`;
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
  
    pendingPoint = `${point.x.toFixed(2)} ${point.y.toFixed(2)} ${point.z.toFixed(2)}`;
  
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
  
      console.log(`Saved in ${img}:`, pendingPoint);
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
    }
  
    // EXPORT (e)
    if (e.key === "e") {
      console.log("=== EXPORT ===");
      console.log(JSON.stringify(placements, null, 2));
  
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
  
  
  // ===== INIT =====
  updateImageLabel();