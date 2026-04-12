export default function createRoutineGameScene(Phaser, onComplete) {
  return class RoutineGame extends Phaser.Scene {
    constructor() {
      super({ key: 'RoutineGame' });
    }

    create() {
      this.width = this.cameras.main.width;
      this.height = this.cameras.main.height;
      const { width, height } = this;
      
      this.sequence = [];

      // --- TEXTURE GENERATION ---
      const g = this.make.graphics({x: 0, y: 0, add: false});
      // Glass panel bg
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(0, 0, 260, 80, 8); // matching rounded-lg
      g.generateTexture('panel-bg', 260, 80);
      g.clear();
      // Drop zone panel
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(0, 0, 320, 420, 12);
      g.generateTexture('drop-zone', 320, 420);
      g.clear();
      // Execute button
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(0, 0, 220, 50, 8); // matched rounded-lg
      g.generateTexture('btn-bg', 220, 50);
      g.destroy();

      // --- BACKGROUND & PARTICLES ---
      // Match #0f0c29 to #1a1a40
      const bgG = this.make.graphics({ x: 0, y: 0, add: false });
      bgG.fillGradientStyle(0x0f0c29, 0x1a1a40, 0x0f0c29, 0x1a1a40, 1);
      bgG.fillRect(0, 0, width, height);
      bgG.generateTexture('gradientBg', width, height);
      bgG.destroy();
      this.add.image(0, 0, 'gradientBg').setOrigin(0);

      // tsParticles simulation (little purple connected dots)
      for (let i = 0; i < 40; i++) {
        const dot = this.add.circle(Math.random() * width, Math.random() * height, Math.random() * 2 + 1, 0x9370DB, 0.2);
        this.tweens.add({ targets: dot, y: '+=30', x: '+=20', duration: 4000 + Math.random() * 4000, yoyo: true, repeat: -1 });
      }

      // Main Title
      const title = this.add.text(width / 2, 40, "Sequence: Daily Routine", {
        fontSize: '36px', fill: '#ffffff', fontWeight: '700', fontFamily: 'Poppins'
      }).setOrigin(0.5);
      title.setTint(0x9370DB, 0x8A2BE2, 0x9370DB, 0x8A2BE2); // Gradient text

      this.add.text(width / 2, 80, "Assemble the steps in the correct sequence.", {
        fontSize: '18px', fill: '#d1d5db', fontFamily: 'Poppins'
      }).setOrigin(0.5);

      const steps = [
        { id: 1, text: "Wake up", art: 'wake' },
        { id: 2, text: "Brush teeth", art: 'brush' },
        { id: 3, text: "Eat breakfast", art: 'breakfast' },
        { id: 4, text: "Go to school", art: 'school' }
      ];

      const shuffled = Phaser.Utils.Array.Shuffle([...steps]);

      // --- LEFT SIDE: Available Steps ---
      this.add.text(width * 0.25, 140, "Available Steps", {
        fontSize: '22px', fill: '#e5e7eb', fontWeight: '600', fontFamily: 'Poppins'
      }).setOrigin(0.5);

      const draggables = [];
      shuffled.forEach((step, i) => {
        const startX = width * 0.25 - 130;
        const startY = 180 + i * 95;

        const container = this.add.container(startX, startY);
        container.setSize(260, 80);
        container.originalDepth = i + 10;
        container.setDepth(container.originalDepth);

        // Glass Match: rgba(0,0,0,0.25) fill, rgba(255,255,255,0.1) stroke
        const bg = this.add.image(0, 0, 'panel-bg').setOrigin(0).setTint(0x000000).setAlpha(0.25);
        
        const borderG = this.add.graphics();
        borderG.lineStyle(1, 0xffffff, 0.1); 
        borderG.strokeRoundedRect(0, 0, 260, 80, 8);

        const cartoon = this.createCartoonArt(step.art);

        const txt = this.add.text(90, 40, step.text, {
          fontSize: '16px', fill: '#e5e7eb', fontFamily: 'Poppins'
        }).setOrigin(0, 0.5);

        container.add([bg, borderG, cartoon, txt]);
        
        container.stepId = step.id;
        container.startX = startX;
        container.startY = startY;

        container.setInteractive({ useHandCursor: true, draggable: true });

        container.on('pointerover', () => { 
           bg.setAlpha(0.35); 
           container.setScale(1.02);
           borderG.clear(); borderG.lineStyle(1, 0xffffff, 0.2); borderG.strokeRoundedRect(0, 0, 260, 80, 8);
        });
        container.on('pointerout', () => { 
           bg.setAlpha(0.25); 
           container.setScale(1);
           borderG.clear(); borderG.lineStyle(1, 0xffffff, 0.1); borderG.strokeRoundedRect(0, 0, 260, 80, 8);
        });

        container.on('dragstart', () => {
          container.setDepth(100);
          const idx = this.sequence.indexOf(container);
          if (idx > -1) {
            this.sequence.splice(idx, 1);
            this.rearrangeSequence();
          }
        });

        container.on('drag', (pointer, dragX, dragY) => {
          container.setPosition(dragX, dragY);
        });

        container.on('dragend', () => {
          container.setDepth(container.originalDepth);

          const dropZoneX = width * 0.75 - 160;
          const dropZoneY = 160;
          const InZone = container.x + 130 > dropZoneX && container.x + 130 < dropZoneX + 320 && 
                         container.y + 40 > dropZoneY && container.y + 40 < dropZoneY + 420;

          if (InZone) {
            const relativeY = container.y - dropZoneY;
            const insertIndex = Math.max(0, Math.min(this.sequence.length, Math.floor(relativeY / 95)));
            if (!this.sequence.includes(container)) {
              this.sequence.splice(insertIndex, 0, container);
            }
          } else {
            const idx = this.sequence.indexOf(container);
            if (idx > -1) this.sequence.splice(idx, 1);
            this.snapBack(container);
          }
          this.rearrangeSequence();
        });

        draggables.push(container);
      });

      // --- RIGHT SIDE: Your Algorithm ---
      const dropZoneX = width * 0.75 - 160;
      const dropZoneY = 160;
      this.add.text(width * 0.75, 140, "Your Algorithm", {
        fontSize: '22px', fill: '#e5e7eb', fontWeight: '600', fontFamily: 'Poppins'
      }).setOrigin(0.5);

      const dropBoxHeight = 420;
      const dropBoxWidth = 320;
      
      // Glass background
      this.add.image(dropZoneX, dropZoneY, 'drop-zone').setOrigin(0).setTint(0x000000).setAlpha(0.25);
      
      // Dashed border logic using small rectangles to simulate border-dashed
      const dashedGrp = this.add.graphics();
      dashedGrp.lineStyle(2, 0x8A2BE2, 1); 
      
      // Draw top and bottom dashes
      for(let x = 0; x < dropBoxWidth; x += 15) {
         dashedGrp.strokeLineShape(new Phaser.Geom.Line(dropZoneX + x, dropZoneY, dropZoneX + Math.min(x+8, dropBoxWidth), dropZoneY));
         dashedGrp.strokeLineShape(new Phaser.Geom.Line(dropZoneX + x, dropZoneY + dropBoxHeight, dropZoneX + Math.min(x+8, dropBoxWidth), dropZoneY + dropBoxHeight));
      }
      // Draw left and right dashes
      for(let y = 0; y < dropBoxHeight; y += 15) {
         dashedGrp.strokeLineShape(new Phaser.Geom.Line(dropZoneX, dropZoneY + y, dropZoneX, dropZoneY + Math.min(y+8, dropBoxHeight)));
         dashedGrp.strokeLineShape(new Phaser.Geom.Line(dropZoneX + dropBoxWidth, dropZoneY + y, dropZoneX + dropBoxWidth, dropZoneY + Math.min(y+8, dropBoxHeight)));
      }

      // --- BOTTOM: Execute Button ---
      const execGrp = this.add.container(width / 2, height - 60);
      
      const execBtnBg = this.add.image(0, 0, 'btn-bg').setOrigin(0.5).setTint(0x8A2BE2);
      execBtnBg.setInteractive({ useHandCursor: true });
      
      const execTxt = this.add.text(0, 0, "Execute Algorithm", {
        fontSize: '18px', fill: '#ffffff', fontWeight: '600', fontFamily: 'Poppins'
      }).setOrigin(0.5);
      
      execGrp.add([execBtnBg, execTxt]);

      execBtnBg.on('pointerover', () => execBtnBg.setTint(0x6A0DAD)); 
      execBtnBg.on('pointerout', () => execBtnBg.setTint(0x8A2BE2));
      execBtnBg.on('pointerdown', () => {
         this.tweens.add({ targets: execGrp, scale: 0.95, duration: 80, yoyo: true });
         this.checkAlgorithm();
      });

      // Feedback Text
      this.feedbackText = this.add.text(width / 2, height - 120, "", {
        fontSize: '18px', fill: '#ef4444', fontStyle: 'italic', fontFamily: 'Poppins'
      }).setOrigin(0.5);
    }

    rearrangeSequence() {
      const dropZoneXBase = this.width * 0.75 - 130;
      const dropZoneYBase = 180;

      this.sequence.forEach((item, index) => {
        const targetX = dropZoneXBase;
        const targetY = dropZoneYBase + (index * 95);
        this.tweens.add({
          targets: item,
          x: targetX,
          y: targetY,
          duration: 250,
          ease: 'Power3.easeOut'
        });
      });
    }

    snapBack(container) {
      this.tweens.add({
        targets: container,
        x: container.startX,
        y: container.startY,
        duration: 400,
        ease: 'Back.easeOut'
      });
    }

    checkAlgorithm() {
      if (this.sequence.length < 4) {
        this.showFeedback("Incomplete algorithm. Place all steps before executing!", "#fcd34d"); 
        return;
      }

      let win = true;
      this.sequence.forEach((item, index) => {
        if (item.stepId !== index + 1) {
          win = false;
        }
      });

      if (win) {
        this.showFeedback("Algorithm Correct!", "#34d399"); 
        this.triggerVictory();
      } else {
        this.showFeedback("Incorrect order. Debug your logic and try again!", "#f87171"); 
        this.sequence.forEach(item => {
           this.tweens.add({ targets: item, x: '+=12', duration: 60, yoyo: true, repeat: 3 });
        });
      }
    }

    showFeedback(message, color) {
      this.feedbackText.setText(message);
      this.feedbackText.setColor(color);
      this.feedbackText.setAlpha(1);
      if (this.feedbackTimer) this.feedbackTimer.remove();
      this.feedbackTimer = this.time.delayedCall(3000, () => {
        this.tweens.add({ targets: this.feedbackText, alpha: 0, duration: 400 });
      });
    }

    createCartoonArt(type) {
      const c = this.add.container(0, 0);
      const g = this.add.graphics();
      const bx = 45, by = 40; 
      
      // Clean circular backdrop matching routine
      g.fillStyle(0xffffff, 0.1);
      g.fillCircle(bx, by, 30);
      
      if (type === 'wake') {
        g.fillStyle(0x8b4513, 1); g.fillRect(bx - 20, by - 10, 8, 30); 
        g.fillStyle(0x38bdf8, 1); g.fillRect(bx - 12, by + 5, 28, 15); 
        g.fillStyle(0xfde047, 1); g.fillCircle(bx + 5, by - 5, 10);     
      } 
      else if (type === 'brush') {
        g.fillStyle(0xf8fafc, 1); g.fillRoundedRect(bx - 20, by - 4, 38, 8, 3); 
        g.fillStyle(0x34d399, 1); g.fillRect(bx - 10, by - 4, 15, 8); 
        g.fillStyle(0x94a3b8, 1); g.fillRect(bx + 10, by - 12, 12, 8); 
        g.fillStyle(0x60a5fa, 1); g.fillCircle(bx + 16, by - 14, 5);    
      } 
      else if (type === 'breakfast') {
        g.fillStyle(0xfb923c, 1); g.beginPath(); g.arc(bx, by + 5, 20, 0, Math.PI, false); g.fillPath(); 
        g.fillStyle(0xffffff, 1); g.fillEllipse(bx, by + 5, 40, 8); 
        g.lineStyle(3, 0x94a3b8); g.beginPath(); g.moveTo(bx + 8, by + 5); g.lineTo(bx + 20, by - 16); g.strokePath();
        g.fillStyle(0x94a3b8, 1); g.fillCircle(bx + 21, by - 18, 5);
        g.fillStyle(0xfde047, 1); g.fillCircle(bx - 8, by + 3, 2); g.fillCircle(bx, by + 5, 2);
      }
      else if (type === 'school') {
        g.fillStyle(0xfacc15, 1); g.fillRoundedRect(bx - 24, by - 12, 48, 28, 4);
        g.fillStyle(0x0f172a, 1); g.fillRect(bx - 20, by - 8, 8, 10); g.fillRect(bx - 8, by - 8, 8, 10); g.fillRect(bx + 4, by - 8, 8, 10);
        g.fillStyle(0x1e293b, 1); g.fillCircle(bx - 12, by + 16, 6); g.fillCircle(bx + 10, by + 16, 6);
      }
      c.add(g);
      return c;
    }

    triggerVictory() {
      const vBox = this.add.rectangle(this.width/2, this.height/2, this.width, 200, 0x000000, 0.85).setDepth(200);
      
      const vText = this.add.text(this.width / 2, this.height / 2, "ALGORITHM MASTERED!", {
        fontSize: '44px', fill: '#34d399', fontWeight: '900', fontFamily: 'Poppins', 
        shadow: { offsetX: 0, offsetY: 0, color: '#10b981', blur: 15, fill: true }
      }).setOrigin(0.5).setDepth(201);

      this.tweens.add({ targets: vText, scale: { start: 0.6, end: 1.05 }, duration: 800, ease: 'Elastic.easeOut', yoyo: true, hold: 1200 });

      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const color = [0xfcd34d, 0x34d399, 0x60a5fa, 0xf472b6, 0xc084fc][Math.floor(Math.random() * 5)];
          const particle = this.add.circle(
            this.width/2 + (Math.random()-0.5)*this.width, 
            this.height/2 + (Math.random()-0.5)*300, 
            Math.random() * 6 + 3, color
          ).setDepth(199);
          
          this.tweens.add({
             targets: particle, 
             x: `+=${(Math.random()-0.5)*150}`, 
             y: '+=250', 
             alpha: 0,
             duration: 1500 + Math.random() * 1200,
             ease: 'Sine.easeIn',
             onComplete: () => particle.destroy()
          });
        }, i * 30);
      }

      this.time.delayedCall(3500, () => {
        if (this.scene.systems.game.onSceneComplete) {
           this.scene.systems.game.onSceneComplete(3);
        }
      });
    }
  };
}
