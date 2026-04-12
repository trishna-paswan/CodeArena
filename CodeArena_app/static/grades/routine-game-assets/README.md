# Routine Game Assets

This folder is for cute gifs and images used in the upgraded Daily Routine Quest game.

## How to Add Images

1. **Create your cute images** for each routine step and save them as PNG or GIF files
2. **Place them in this folder** with these exact names:
   - `wake-up.png` (or wake-up.gif)
   - `brush-teeth.png` (or brush-teeth.gif)
   - `eat-breakfast.png` (or eat-breakfast.gif)
   - `go-school.png` (or go-school.gif)

## How to Enable Images in the Game

Once you've added your images, uncomment the lines in `routineGame.js` in the `preload()` function:

```javascript
preload() {
  const assetPath = '/routine-game-assets/';
  
  // Uncomment these lines:
  this.load.image('wake-up', assetPath + 'wake-up.png');
  this.load.image('brush-teeth', assetPath + 'brush-teeth.png');
  this.load.image('eat-breakfast', assetPath + 'eat-breakfast.png');
  this.load.image('go-school', assetPath + 'go-school.png');
}
```

## Current Game Features

✨ **Enhanced GUI:**
- Beautiful purple gradient background
- Rounded card-style buttons with shadows
- Color-coded drop zones with status indicators
- Smooth hover and drag animations

🎨 **Visual Effects:**
- 3D effects with shadows and scaling
- Particle effects on correct placements
- Fireworks celebration on completion
- Smooth tweens and transitions
- Glow effects on interactive elements

🎮 **Gameplay:**
- Drag-and-drop sequencing
- Real-time visual feedback (green for correct, red for incorrect)
- Emoji icons for each routine step
- Word shaking animation for incorrectly placed items

## Recommended Image Specifications

- **Format:** PNG (preferred) or animated GIF
- **Size:** 80x80 pixels (will be scaled to fit)
- **Style:** Cute, colorful, engaging for children
- **Background:** Transparent PNG recommended

## Example Cute Image Ideas

1. **Wake Up** ☀️ - Sleeping person waking up, sunrise, alarm clock
2. **Brush Teeth** 🪥 - Toothbrush, happy smile, sparkly teeth
3. **Eat Breakfast** 🥣 - Cereal bowl, toast, milk glass
4. **Go to School** 🚌 - School building, school bus, backpack

Have fun creating! 🎨
