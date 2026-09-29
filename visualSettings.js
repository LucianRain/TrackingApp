// Visual settings for the Tracking App.
// Edit values here to change the look of the app — index.html reads from this file.

window.VisualSettings = {
  // Each tab has its own solid background color (hue/saturation/lightness).
  // Both sit in near-black "soil" greens so the plant theme stays dark and quiet.
  background: {
    events: {
      // Hue 0-360. ~120-160 = green.
      hue: 145,
      // Saturation % — lower is more desaturated/grey. Suggested range: 10-35.
      saturation: 20,
      // Lightness % — lower is darker. Suggested range: 4-12 for dark mode.
      lightness: 6,
    },
    train: {
      hue: 150,
      saturation: 16,
      lightness: 5,
    },
  },

  // Drifting background foliage: scattered single leaves and small sprigs
  // at varying sizes and depths, falling slowly and swaying side to side.
  leaves: {
    // How many leaves per 100,000 px² of screen (a phone is ~3-4 of those).
    // Suggested range: 3 (sparse) to 15 (lush).
    density: 8,

    // Leaf length range (px). Far leaves use the small end, near ones the large end.
    // Suggested range: 6 to 30.
    minSize: 7,
    maxSize: 22,

    // Chance (0-1) that an item is a sprig (a stem with several leaves)
    // instead of a single leaf. Suggested range: 0 to 0.4.
    sprigChance: 0.2,

    // Fall speed in px/second (near leaves move faster than far ones). 0 = static.
    // Suggested range: 0 to 15.
    speed: 5,

    // How far (px) leaves wander side to side as they fall.
    // Suggested range: 0 to 40.
    sway: 18,

    // Overall opacity of the leaves (0 = invisible, 1 = solid).
    // Suggested range: 0.03 (subtle) to 0.15 (bold — may hurt readability above 0.12).
    opacity: 0.08,

    // Chance (0-1) that a leaf is gold instead of green.
    goldChance: 0.12,
  },

  eventCard: {
    // Blur radius (px) applied to whatever passes behind the card.
    // Suggested range: 0 (no blur) to 24 (very blurred).
    blurPx: 5,

    // Brightness multiplier applied behind the card (1 = unchanged, 0 = black).
    // Suggested range: 0.3 (very dark) to 1 (no darkening).
    darken: 0.9,

  },
};
