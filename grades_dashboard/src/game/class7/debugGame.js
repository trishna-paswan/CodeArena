export default function createDebugGameScene(Phaser) {
  return class DebugGame extends Phaser.Scene {
    constructor() { super({ key: 'DebugGame' }); }
    create() {
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, 50, "Debugging: Fix the Code", { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2, "[ Simulated Code Debugging ]", { align: 'center', fill: '#94a3b8' }).setOrigin(0.5);
        this.time.delayedCall(1500, () => { if (this.scene.systems.game.onSceneComplete) this.scene.systems.game.onSceneComplete(3); });
    }
  }
}
