export default function createDirectionGameScene(Phaser, onComplete) {
  return class DirectionGame extends Phaser.Scene {
    constructor() {
      super({ key: 'DirectionGame' });
    }

    create() {
      const { width, height } = this.cameras.main;
      
      this.add.text(width / 2, 50, "Direction Logic: Guide Robot to Flag", {
        fontSize: '28px', fill: '#fff', fontWeight: 'bold'
      }).setOrigin(0.5);

      // Simple grid map representation
      // 0 = empty, 1 = obstacle, 2 = start, 3 = goal
      const map = [
        [0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 3, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];

      const tileSize = 60;
      const offsetX = width / 2 - (map[0].length * tileSize) / 2;
      const offsetY = height / 2 - 100;

      let robotPath = [];
      let playerPos = { x: 1, y: 1 };

      // Draw Grid
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          const px = offsetX + x * tileSize + tileSize/2;
          const py = offsetY + y * tileSize + tileSize/2;
          const rect = this.add.rectangle(px, py, tileSize-4, tileSize-4, 0x334155);
          
          if (map[y][x] === 1) rect.setFillStyle(0x94a3b8);
          if (map[y][x] === 2) this.add.circle(px, py, tileSize/3, 0x3b82f6);
          if (map[y][x] === 3) this.add.star(px, py, 5, 10, 20, 0xeab308);
        }
      }

      this.robot = this.add.circle(offsetX + playerPos.x * tileSize + tileSize/2, offsetY + playerPos.y * tileSize + tileSize/2, tileSize/4, 0x60a5fa);

      // Controls
      const btnY = height - 100;
      const btnSpacing = 150;

      const createBtn = (x, text, dx, dy) => {
        const btnBox = this.add.rectangle(x, btnY, 120, 50, 0x1e293b).setInteractive().setStrokeStyle(2, 0x6366f1);
        this.add.text(x, btnY, text, { fill: '#fff' }).setOrigin(0.5);
        btnBox.on('pointerdown', () => this.tryMove(dx, dy, tileSize, offsetX, offsetY, map));
      };

      createBtn(width/2 - btnSpacing, "Move Left", -1, 0);
      createBtn(width/2, "Move Right", 1, 0);
      createBtn(width/2 + btnSpacing, "Move Down", 0, 1);
      createBtn(width/2 + btnSpacing * 2, "Move Up", 0, -1);
      
      this.playerPos = playerPos;
    }

    tryMove(dx, dy, size, offX, offY, map) {
      const nx = this.playerPos.x + dx;
      const ny = this.playerPos.y + dy;

      if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[0].length && map[ny][nx] !== 1) {
        this.playerPos.x = nx;
        this.playerPos.y = ny;

        this.tweens.add({
          targets: this.robot,
          x: offX + nx * size + size/2,
          y: offY + ny * size + size/2,
          duration: 300,
          onComplete: () => {
            if (map[ny][nx] === 3) {
              this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Path Clear! Great algorithm.", {
                fontSize: '32px', fill: '#22c55e', backgroundColor: '#000', padding: { x: 20, y: 10 }
              }).setOrigin(0.5);
              this.time.delayedCall(1500, () => { if (this.scene.settings.data.onComplete) this.scene.settings.data.onComplete(3); }); // Wait actually we use closure onComplete
              if (this.scene.systems.game.onSceneComplete) this.scene.systems.game.onSceneComplete(3);
            }
          }
        });
      } else {
        this.cameras.main.shake(100, 0.01);
      }
    }
  };
}
