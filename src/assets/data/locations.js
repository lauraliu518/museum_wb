export const locations = {
  A: {
    imageSrc: "/src/assets/scene_assets/test.jpg",
    //targets: other clickable locations from current location
    links: [
      { target: "B", position: "0 -1.2 -4" },
      { target: "C", position: "2 -1.2 -3.5" },
    ],
    //artifacts: art works visible from current locaiton
    artifacts: [
      {
        id: "biennial-sample-01",
        title: "Untitled (sample)",
        artist: "Sample Artist",
        year: "2026",
        body: "This is placeholder copy for a museum label.",
        position: "-1.1 -0.55 -3.6",
        rotation: "0 18 0",
      },
    ],
  },
  B: {
    imageSrc: "/src/assets/scene_assets/test(1).jpg",
    links: [
      { target: "A", position: "-1.6 -1.2 -3.7" },
      { target: "D", position: "1.8 -1.2 -3.5" },
    ],
  },
  C: {
    imageSrc: "/src/assets/scene_assets/scene_c.jpeg",
    links: [{ target: "A", position: "-0.3 -1.2 -4.2" }],
  },
  D: {
    imageSrc: "/src/assets/scene_assets/scene_d.jpeg",
    links: [{ target: "B", position: "0.4 -1.2 -4.1" }],
  },
};