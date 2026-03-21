"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';

const PhaserGame = ({ gameId, levelId, onComplete }: { gameId: string, levelId: string, onComplete?: (stars: number) => void }) => {
  const gameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let _game: any = null;
    let _phaser: any = null;

    const initPhaser = async () => {
      _phaser = await import("phaser");
      const Phaser = _phaser.default || _phaser;
      
      let SceneClass: any;
      
      // Dynamic mapping of gameId to the scene file
      try {
        if (gameId === "TeaGame") {
          const mod = await import("@/game/class6/teaGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "RoutineGame") {
          const mod = await import("@/game/class6/routineGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "DirectionGame") {
          const mod = await import("@/game/class6/directionGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "PatternGame") {
          const mod = await import("@/game/class6/patternGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "MazeGame") {
          const mod = await import("@/game/class6/mazeGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "BuilderGame") {
          const mod = await import("@/game/class7/builderGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "TrafficGame") {
          const mod = await import("@/game/class7/trafficGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "DebugGame") {
          const mod = await import("@/game/class7/debugGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "FactoryGame") {
          const mod = await import("@/game/class7/factoryGame");
          SceneClass = mod.default(Phaser);
        } else if (gameId === "TreasureGame") {
          const mod = await import("@/game/class7/treasureGame");
          SceneClass = mod.default(Phaser);
        } else {
          // Fallback Generic Scene
          SceneClass = class GenericScene extends Phaser.Scene {
            constructor() { super({ key: 'Generic' }); }
            create() {
              this.add.text(400, 300, `Game: ${gameId}\nStarting soon...`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
              this.time.delayedCall(1500, () => {
                if ((this.scene.systems.game as any).onSceneComplete) (this.scene.systems.game as any).onSceneComplete(3);
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load scene", gameId, err);
      }

      const config = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 800,
        height: 600,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        backgroundColor: '#0f172a',
        physics: {
          default: 'arcade',
          arcade: { debug: false }
        },
        scene: [SceneClass]
      };

      _game = new Phaser.Game(config);
      // Pass the callback to the game instance so scenes can call it
      (_game as any).onSceneComplete = (stars: number) => {
        if (onComplete) onComplete(stars);
      };

      gameRef.current = _game;
      setIsLoaded(true);
    };

    if (containerRef.current && !gameRef.current) {
      initPhaser();
    }

    return () => {
      if (gameRef.current) {
        document.body.style.cursor = 'default';
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameId, levelId, onComplete]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-slate-900" ref={containerRef}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-slate-900/50 backdrop-blur-sm">
          Loading Engine...
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(PhaserGame), { ssr: false });

