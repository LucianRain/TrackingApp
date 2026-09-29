// Visual settings for the Tracking App.
// Edit values here to change the look of the app — index.html reads from this file.

window.VisualSettings = {
  layout: {
    // Height (px) of the bottom tab bar. The divider line and the
    // content area (including the square grid) sit just above it.
    // Suggested range: 40 (compact) to 80 (roomy).
    tabBarHeight: 56,
  },

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

  // Drifting background leaves. Each cell holds one small leaf.
  grid: {
    // Size (px) of each grid cell (spacing between leaves).
    // Suggested range: 40 (dense) to 120 (sparse).
    cellSize: 72,

    // Length (px) of each leaf. Keep well under cellSize.
    // Suggested range: 8 to 24.
    squareSize: 14,

    // Drift speed in px/second. Higher = faster movement. 0 = static.
    // Suggested range: 0 to 20.
    speedX: 6,
    speedY: 4,

    // Opacity of the leaves (0 = invisible, 1 = solid).
    // Suggested range: 0.03 (subtle) to 0.15 (bold — may hurt readability above 0.12).
    opacity: 0.07,

    // Every Nth leaf is drawn gold instead of green. 0 = never.
    goldEvery: 7,
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
