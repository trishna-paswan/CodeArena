export default function createTeaGameScene(Phaser, onComplete) {
  return class TeaGame extends Phaser.Scene {
    constructor() {
      super({ key: 'TeaGame' });
    }

    create() {
      const { width, height } = this.cameras.main;
      
      this.add.text(width / 2, 50, "Make Tea: Drag steps in order", {
        fontSize: '28px', fill: '#fff', fontWeight: 'bold'
      }).setOrigin(0.5);

      const steps = [
        { id: 1, text: "Boil Water" },
        { id: 2, text: "Add Tea Leaves" },
        { id: 3, text: "Add Sugar & Milk" },
        { id: 4, text: "Serve" }
      ];

      // Shuffle for gameplay
      const shuffled = Phaser.Utils.Array.Shuffle([...steps]);

      const dropZones = [];
      const draggables = [];

      // Create Drop Zones
      for (let i = 0; i < 4; i++) {
        const zoneX = width / 2;
        const zoneY = 150 + i * 80;
        
        const zoneBox = this.add.rectangle(zoneX, zoneY, 300, 60, 0x1e293b).setStrokeStyle(2, 0x475569);
        const zone = this.add.zone(zoneX, zoneY, 300, 60).setRectangleDropZone(300, 60);
        zone.stepIndex = i + 1; // Expected step ID
        dropZones.push({ zone, box: zoneBox });
        
        this.add.text(zoneX - 130, zoneY, `${i + 1}.`, { fontSize: '20px', fill: '#94a3b8' }).setOrigin(0, 0.5);
      }

      // Create Draggable Items
      shuffled.forEach((step, i) => {
        const startX = width / 4;
        const startY = 150 + i * 80;

        const container = this.add.container(startX, startY);
        container.setSize(200, 50);
        
        const bg = this.add.rectangle(0, 0, 200, 50, 0x3b82f6).setInteractive();
        const txt = this.add.text(0, 0, step.text, { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);
        
        container.add([bg, txt]);
        container.stepId = step.id;
        
        this.input.setDraggable(bg);

        bg.on('dragstart', () => {
          this.children.bringToTop(container);
          bg.setFillStyle(0x2563eb);
        });

        bg.on('drag', (pointer, dragX, dragY) => {
          container.x = dragX;
          container.y = dragY;
        });

        bg.on('drop', (pointer, target) => {
          container.x = target.x;
          container.y = target.y;
          container.currentZone = target.stepIndex;
          this.checkWinCondition(draggables);
        });

        bg.on('dragend', (pointer, dragX, dragY, dropped) => {
          bg.setFillStyle(0x3b82f6);
          if (!dropped) {
            container.x = startX;
            container.y = startY;
            container.currentZone = null;
          }
        });

        draggables.push(container);
      });
    }

    checkWinCondition(draggables) {
      let correct = 0;
      draggables.forEach(d => {
        if (d.stepId === d.currentZone) correct++;
      });

      if (correct === 4) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, "Excellent Sequence!", {
          fontSize: '32px', fill: '#22c55e', fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.time.delayedCall(1500, () => {
          if (onComplete) onComplete(3);
        });
      }
    }
  };
}
