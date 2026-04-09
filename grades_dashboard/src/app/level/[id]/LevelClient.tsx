"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TheoryCard from "@/components/TheoryCard";
import PhaserGame from "@/components/PhaserGame";
import { useProgress } from "@/lib/useProgress";
import { ArrowLeft } from "lucide-react";
import { LEVEL_DATA } from "@/lib/levelData";

export function generateStaticParams() {
  return [
    { id: "6-1" }, { id: "6-2" }, { id: "6-3" }, { id: "6-4" }, { id: "6-5" },
    { id: "7-1" }, { id: "7-2" }, { id: "7-3" }, { id: "7-4" }, { id: "7-5" }
  ];
}

export default function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const levelId = unwrappedParams.id;
  const router = useRouter();
  const { completeLevel } = useProgress();
  
  const [phase, setPhase] = useState("theory"); // 'theory' | 'game' | 'completed'
  
  const levelInfo = (LEVEL_DATA as any)[levelId] || {
    classId: levelId.split("-")[0],
    title: "Generic Level",
    explanation: "Proceed to play.",
    example: "// no specific logic",
    gameInfo: "Generic"
  };

  const handleStartGame = () => {
    setPhase("game");
  };

  const handleGameComplete = (starsScored: number) => {
    completeLevel(levelId, starsScored || 3);
    setPhase("completed");
  };

  const handleReturnToMap = () => {
    router.push(`/class/${levelInfo.classId}`);
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center">
      <button 
        onClick={handleReturnToMap}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/80 py-2 px-4 rounded-full border border-slate-700/50 backdrop-blur-md"
      >
        <ArrowLeft size={16} /> Back to Map
      </button>

      {phase === "theory" && (
        <TheoryCard 
          title={levelInfo.title}
          explanation={levelInfo.explanation}
          example={levelInfo.example}
          onStart={handleStartGame}
        />
      )}

      {phase === "game" && (
        <div className="w-full max-w-5xl h-[80vh] min-h-[600px] glass-panel rounded-3xl overflow-hidden relative">
          <PhaserGame 
            gameId={levelInfo.gameInfo} 
            levelId={levelId}
            onComplete={handleGameComplete} 
          />
        </div>
      )}

      {phase === "completed" && (
        <div className="glass-panel w-full max-w-lg p-10 text-center rounded-3xl flex flex-col items-center">
          <div className="text-6xl mb-6">🎉⭐🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">Level Cleared!</h2>
          <p className="text-slate-300 mb-8">You successfully mastered this concept.</p>
          <button 
            onClick={handleReturnToMap}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all font-xl"
          >
            CONTINUE JOURNEY
          </button>
        </div>
      )}
    </div>
  );
}
