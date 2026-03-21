export default function createPatternGameScene(Phaser, onComplete) {
  return class PatternGame extends Phaser.Scene {
    constructor() {
      super({ key: 'PatternGame' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, 50, "Pattern Game: Detect the Loop", {
            fontSize: '28px', fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, "Pattern loops simulated for Class 6\n(Auto resolving for prototype)", {
            align: 'center', fill: '#94a3b8'
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            if (this.scene.systems.game.onSceneComplete) this.scene.systems.game.onSceneComplete(3);
        });
    }
  }
}
