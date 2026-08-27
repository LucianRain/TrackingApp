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
  background: {
    events: {
      // Hue 0-360. ~210-230 = blue.
      hue: 215,
      // Saturation % — lower is more desaturated/grey. Suggested range: 10-35.
      saturation: 22,
      // Lightness % — lower is darker. Suggested range: 15-35.
      lightness: 28,
    },
    train: {
      // Hue 0-360. ~345-15 = red.
      hue: 355,
      saturation: 30,
      lightness: 20,
    },
  },

  grid: {
    // Size (px) of each grid cell, including the gap around its square.
    // Suggested range: 30 (dense) to 100 (sparse).
    cellSize: 50,

    // Size (px) of each square within its cell. Keep <= cellSize or squares overlap.
    // Suggested range: half of cellSize (visible gaps) up to cellSize (no gaps).
    squareSize: 45,

    // Drift speed in px/second. Higher = faster movement. 0 = static.
    // Suggested range: 0 to 20.
    speedX: 6,
    speedY: 4,

    // Opacity of the squares (0 = invisible, 1 = solid white).
    // Suggested range: 0.05 (subtle) to 0.3 (bold — may hurt clock readability above 0.2).
    opacity: 0.01,
  },

  eventCard: {
    // Blur radius (px) applied to whatever passes behind the card.
    // Suggested range: 0 (no blur) to 24 (very blurred).
    blurPx: 5,

    // Brightness multiplier applied behind the card (1 = unchanged, 0 = black).
    // Suggested range: 0.3 (very dark) to 1 (no darkening).
    darken: 0.9,

    // Card background tint opacity, layered on top of the blur.
    // Suggested range: 0.03 (barely visible) to 0.2 (solid-ish card).
    backgroundOpacity: 0.02,

    // Card border opacity.
    // Suggested range: 0.1 (subtle) to 0.5 (strong outline).
    borderOpacity: 0.25,
  },
};
