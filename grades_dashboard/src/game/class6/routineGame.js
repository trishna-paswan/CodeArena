export default function createRoutineGameScene(Phaser, onComplete) {
  return class RoutineGame extends Phaser.Scene {
    constructor() {
      super({ key: 'RoutineGame' });
    }

    create() {
      const { width, height } = this.cameras.main;
      
      this.add.text(width / 2, 50, "Daily Routine: Put actions in order", {
        fontSize: '28px', fill: '#fff', fontWeight: 'bold'
      }).setOrigin(0.5);

      const steps = [
        { id: 1, text: "Wake Up" },
        { id: 2, text: "Brush Teeth" },
        { id: 3, text: "Eat Breakfast" },
        { id: 4, text: "Go to School" }
      ];

      const shuffled = Phaser.Utils.Array.Shuffle([...steps]);
      const draggables = [];

      for (let i = 0; i < 4; i++) {
        const zoneX = width / 2 + 100;
        const zoneY = 150 + i * 80;
        this.add.rectangle(zoneX, zoneY, 300, 60, 0x1e293b).setStrokeStyle(2, 0x475569);
        const zone = this.add.zone(zoneX, zoneY, 300, 60).setRectangleDropZone(300, 60);
        zone.stepIndex = i + 1;
        this.add.text(zoneX - 130, zoneY, `${i + 1}.`, { fontSize: '20px', fill: '#94a3b8' }).setOrigin(0, 0.5);
      }

      shuffled.forEach((step, i) => {
        const startX = width / 4 - 50;
        const startY = 150 + i * 80;

        const container = this.add.container(startX, startY);
        container.setSize(200, 50);
        
        const bg = this.add.rectangle(0, 0, 200, 50, 0x8b5cf6).setInteractive();
        const txt = this.add.text(0, 0, step.text, { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);
        container.add([bg, txt]);
        container.stepId = step.id;
        
        this.input.setDraggable(bg);

        bg.on('dragstart', () => this.children.bringToTop(container));
        bg.on('drag', (p, dragX, dragY) => { container.x = dragX; container.y = dragY; });
        bg.on('drop', (p, target) => {
          container.x = target.x; container.y = target.y;
          container.currentZone = target.stepIndex;
          this.checkWinCondition(draggables);
        });
        bg.on('dragend', (p, x, y, dropped) => {
          if (!dropped) { container.x = startX; container.y = startY; container.currentZone = null; }
        });

        draggables.push(container);
      });
    }

    checkWinCondition(draggables) {
      if (draggables.every(d => d.stepId === d.currentZone)) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, "Perfect Sequence!", {
          fontSize: '32px', fill: '#22c55e', fontWeight: 'bold'
        }).setOrigin(0.5);
        this.time.delayedCall(1000, () => { if (onComplete) onComplete(3); });
      }
    }
  };
}
