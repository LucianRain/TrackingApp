// Visual settings for the Tracking App.
// Edit values here to change the look of the app — index.html reads from this file.

window.VisualSettings = {
  background: {
    // How long (ms) one full rainbow hue cycle takes. Lower = faster color change.
    // Suggested range: 10000 (fast) to 120000 (~2 min, very slow).
    cycleDurationMs: 30000,

    // Saturation % of the background color. Higher = more vivid/colorful.
    // Suggested range: 15 (nearly gray) to 60 (vivid). Keep low so white text stays readable.
    saturation: 35,

    // Lightness % of the background color. Higher = brighter background.
    // Suggested range: 15 (near-black) to 40 (medium). Keep low for contrast with white text.
    lightness: 25,
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
    opacity: 0.12,
  },

  eventCard: {
    // Blur radius (px) applied to whatever passes behind the card.
    // Suggested range: 0 (no blur) to 24 (very blurred).
    blurPx: 12,

    // Brightness multiplier applied behind the card (1 = unchanged, 0 = black).
    // Suggested range: 0.3 (very dark) to 1 (no darkening).
    darken: 0.6,

    // Card background tint opacity, layered on top of the blur.
    // Suggested range: 0.03 (barely visible) to 0.2 (solid-ish card).
    backgroundOpacity: 0.08,

    // Card border opacity.
    // Suggested range: 0.1 (subtle) to 0.5 (strong outline).
    borderOpacity: 0.25,
  },
};
