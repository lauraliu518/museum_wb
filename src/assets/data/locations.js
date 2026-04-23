// artifacts: [
//   {
//     id: "biennial-sample-01", (room1/dollroom, room2/bigroom, room3/balcony)
//     title: "Untitled (sample)",
//     artist: "Sample Artist",
//     year: "2026",
//     body: "This is placeholder copy for a museum label.",
//     position: "-1.1 -0.55 -3.6",
//     rotation: "0 18 0",
//   },
// ],


export const locations = {

  // -------- GALLERY 1 --------
  A: {
    imageSrc: "/src/assets/scene_assets/gallery1_1.jpg",
    links: [
      { target: "B", position: "-4.81 -0.96 -0.98" },
      { target: "J", position: "-4.83 -0.33 -1.19" }
    ],
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
    imageSrc: "/src/assets/scene_assets/gallery1_2.jpg",
    links: [
      { target: "A", position: "-4.96 -0.61 -0.05" },
      { target: "C", position: "4.61 -1.91 -0.26" }
    ]
  },

  C: {
    imageSrc: "/src/assets/scene_assets/gallery1_3.jpg",
    links: [
      { target: "B", position: "2.15 -1.57 4.22" },
      { target: "D", position: "-1.30 -1.65 -4.53" }
    ]
  },

  D: {
    imageSrc: "/src/assets/scene_assets/gallery1_4.jpg",
    links: [
      { target: "C", position: "-4.33 -1.42 -2.04" },
      { target: "E", position: "4.73 -1.55 0.36" }
    ]
  },

  E: {
    imageSrc: "/src/assets/scene_assets/gallery1_5.jpg",
    links: [
      { target: "D", position: "-4.51 -1.48 -1.56" },
      { target: "F", position: "4.72 -1.40 0.82" }
    ]
  },

  F: {
    imageSrc: "/src/assets/scene_assets/gallery1_6.jpg",
    links: [
      { target: "E", position: "-2.47 -1.52 -4.06" },
      { target: "G", position: "-2.41 -1.59 4.07" }
    ]
  },

  G: {
    imageSrc: "/src/assets/scene_assets/gallery1_7.jpg",
    links: [
      { target: "H", position: "-3.96 -1.44 -2.69" }
    ]
  },

  H: {
    imageSrc: "/src/assets/scene_assets/gallery1_8.jpg",
    links: [
      { target: "G", position: "4.79 -1.09 0.89" },
      { target: "I", position: "-4.66 -1.79 0.05" }
    ]
  },

  I: {
    imageSrc: "/src/assets/scene_assets/gallery1_9.jpg",
    links: [
      { target: "H", position: "4.31 -2.05 -1.47" },
      { target: "J", position: "-3.51 -1.04 -3.39" }
    ]
  },

  J: {
    imageSrc: "/src/assets/scene_assets/gallery1_10.jpg",
    links: [
      { target: "I", position: "4.83 -1.14 -0.54" },
      { target: "A", position: "4.07 -1.04 -2.71" }
    ]
  },


  // -------- GALLERY 2 --------
  L: {
    imageSrc: "/src/assets/scene_assets/gallery2_1.jpg",
    links: [
      { target: "M", position: "-4.96 -0.41 0.44" },
      { target: "O", position: "-4.77 -0.41 -1.42" }
    ]
  },

  M: {
    imageSrc: "/src/assets/scene_assets/gallery2_2.jpg",
    links: [
      { target: "L", position: "4.84 -1.08 -0.59" },
      { target: "N", position: "-2.75 -0.92 4.07" }
    ]
  },

  N: {
    imageSrc: "/src/assets/scene_assets/gallery2_3.jpg",
    links: [
      { target: "M", position: "2.47 -1.13 4.18" },
      { target: "O", position: "0.41 -0.75 4.92" }
    ]
  },

  O: {
    imageSrc: "/src/assets/scene_assets/gallery2_4.jpg",
    links: [
      { target: "N", position: "4.77 -1.34 -0.62" },
      { target: "Q", position: "-4.42 -0.70 2.20" }
    ]
  },


  // -------- GALLERY 3 --------
  Q: {
    imageSrc: "/src/assets/scene_assets/gallery3_1.jpg",
    links: [
      { target: "Z", position: "-2.83 -1.37 -3.88" },
      { target: "R", position: "-4.91 -0.79 0.46" }
    ]
  },

  R: {
    imageSrc: "/src/assets/scene_assets/gallery3_2.jpg",
    links: [
      { target: "Q", position: "4.78 -1.43 -0.15" },
      // { target: "S", position: "-4.73 -1.46 -0.70" },
      { target: "S", position: "-4.57 -1.98 -0.36" }
    ]
  },

  S: {
    imageSrc: "/src/assets/scene_assets/gallery3_3.jpg",
    links: [
      { target: "R", position: "3.99 -1.80 -2.40" },
      { target: "T", position: "-2.71 -1.80 3.79" }
    ]
  },

  T: {
    imageSrc: "/src/assets/scene_assets/gallery3_4.jpg",
    links: [
      { target: "S", position: "4.14 -2.60 -1.01" },
      { target: "U", position: "-4.62 -1.55 1.07" }
    ]
  },

  U: {
    imageSrc: "/src/assets/scene_assets/gallery3_5.jpg",
    links: [
      { target: "T", position: "-3.45 -0.98 3.48" },
      { target: "V", position: "-4.56 -0.74 -1.89" }
    ]
  },

  V: {
    imageSrc: "/src/assets/scene_assets/gallery3_6.jpg",
    links: [
      { target: "U", position: "3.95 -1.72 -2.51" },
      { target: "W", position: "-4.81 -1.29 0.42" }
    ]
  },

  W: {
    imageSrc: "/src/assets/scene_assets/gallery3_7.jpg",
    links: [
      { target: "X", position: "-3.07 -0.49 3.91" }
    ]
  },

  X: {
    imageSrc: "/src/assets/scene_assets/gallery3_8.jpg",
    links: [
      { target: "W", position: "-0.58 -1.17 -4.82" },
      { target: "Y", position: "1.85 -1.45 4.41" }
    ]
  },

  Y: {
    imageSrc: "/src/assets/scene_assets/gallery3_9.jpg",
    links: [
      { target: "X", position: "-1.22 -0.99 -4.74" },
      { target: "Z", position: "4.87 -0.90 -0.62" }
    ]
  },

  Z: {
    imageSrc: "/src/assets/scene_assets/gallery3_10.jpg",
    links: [
      { target: "Y", position: "4.45 -0.73 2.12" },
      { target: "AC", position: "4.00 -1.41 2.64" }
    ]
  },


  // -------- GALLERY 4 --------
  AC: {
    imageSrc: "/src/assets/scene_assets/gallery4_1.jpg",
    links: [
      { target: "AD", position: "-4.41 -0.65 2.26" },
      { target: "Q", position: "4.73 -0.91 -1.32" }
    ]
  },

  AD: {
    imageSrc: "/src/assets/scene_assets/gallery4_2.jpg",
    links: [
      { target: "AC", position: "4.43 -1.07 2.03" },
      { target: "AE", position: "-0.60 -1.47 4.73" },
      { target: "AG", position: "-4.29 -1.45 2.10" }
    ]
  },

  AE: {
    imageSrc: "/src/assets/scene_assets/gallery4_3.jpg",
    links: [
      { target: "AD", position: "2.99 -1.22 3.80" },
      { target: "AF", position: "-4.84 -1.15 0.47" }
    ]
  },

  AF: {
    imageSrc: "/src/assets/scene_assets/gallery4_4.jpg",
    links: [
      { target: "AE", position: "4.68 -1.75 0.02" }
    ]
  },


  // -------- GALLERY 5 --------
  AG: {
    imageSrc: "/src/assets/scene_assets/gallery5_1.jpg",
    links: [
      { target: "AC", position: "4.60 -1.77 0.79" },
      { target: "AH", position: "-3.72 -0.56 3.28" },
      { target: "AI", position: "-4.88 -1.00 0.37" },
      { target: "AL", position: "-4.91 -0.37 -0.84"}
    ]
  },

  AH: {
    imageSrc: "/src/assets/scene_assets/gallery5_2.jpg",
    links: [
      { target: "AG", position: "4.86 -1.14 0.10" },
      { target: "AI", position: "-4.60 -1.07 -1.62" }
    ]
  },

  AI: {
    imageSrc: "/src/assets/scene_assets/gallery5_3.jpg",
    links: [
      // { target: "AH", position: "-4.58 -0.80 1.82" },
      { target: "AJ", position: "-4.51 -0.77 1.99" }
    ]
  },

  AJ: {
    imageSrc: "/src/assets/scene_assets/gallery5_4.jpg",
    links: [
      { target: "AI", position: "-1.44 -1.10 4.66" },
      { target: "AG", position: "-3.96 -0.49 -3.01" }
    ]
  },


  // -------- GALLERY 6 --------
  AL: {
    imageSrc: "/src/assets/scene_assets/gallery6_1.jpg",
    links: [
      { target: "AH", position: "4.83 -1.26 -0.06" },
      { target: "AM", position: "-4.87 -1.10 0.05" }
    ]
  },

  AM: {
    imageSrc: "/src/assets/scene_assets/gallery6_2.jpg",
    links: [
      { target: "AL", position: "4.41 -1.94 1.32" }
    ]
  }

};