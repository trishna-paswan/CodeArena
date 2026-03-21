export default function createFactoryGameScene(Phaser) {
  return class FactoryGame extends Phaser.Scene {
    constructor() { super({ key: 'FactoryGame' }); }
    create() {
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, 50, "Robot Factory: While Loops", { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2, "[ Simulated Factory while loop ]", { align: 'center', fill: '#94a3b8' }).setOrigin(0.5);
        this.time.delayedCall(1500, () => { if (this.scene.systems.game.onSceneComplete) this.scene.systems.game.onSceneComplete(3); });
    }
  }
}
