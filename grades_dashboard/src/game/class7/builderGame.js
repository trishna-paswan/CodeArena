export default function createBuilderGameScene(Phaser) {
  return class BuilderGame extends Phaser.Scene {
    constructor() { super({ key: 'BuilderGame' }); }
    create() {
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, 50, "Code Builder: Use Loops to Build", { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2, "[ Simulated Loop Building Mechanic ]", { align: 'center', fill: '#94a3b8' }).setOrigin(0.5);
        this.time.delayedCall(1500, () => { if (this.scene.systems.game.onSceneComplete) this.scene.systems.game.onSceneComplete(3); });
    }
  }
}
