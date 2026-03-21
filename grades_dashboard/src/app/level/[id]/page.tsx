"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TheoryCard from "@/components/TheoryCard";
import PhaserGame from "@/components/PhaserGame";
import { useProgress } from "@/lib/useProgress";
import { ArrowLeft } from "lucide-react";

// The theory blocks mapping for each specific level
const LEVEL_DATA = {
  "6-1": {
    classId: "6",
    title: "Algorithm: Tea Making",
    explanation: "An algorithm is like a recipe! It is a set of step-by-step instructions to complete a task. Let's practice by making tea in the correct order.",
    example: "1. Boil Water\n2. Add Tea Leaves\n3. Add Sugar and Milk\n4. Serve",
    gameInfo: "TeaGame"
  },
  "6-2": {
    classId: "6",
    title: "Sequence: Daily Routine",
    explanation: "Execution order matters. If you put on your shoes before your socks, that's a bug! Arrange your daily actions sequentially.",
    example: "wake_up()\nbrush_teeth()\neat_breakfast()\ngo_to_school()",
    gameInfo: "RoutineGame"
  },
  "6-3": {
    classId: "6",
    title: "Instructions: Direction",
    explanation: "Computers only do exactly what you tell them. Guide the character to the goal using precise directional commands.",
    example: "move_forward(2)\nturn_left()\nmove_forward(1)",
    gameInfo: "DirectionGame"
  },
  "6-4": {
    classId: "6",
    title: "Repetition: Loops",
    explanation: "Don't repeat yourself! Use a loop to perform the same action multiple times to form a pattern.",
    example: "for i in range(4):\n   draw_square()",
    gameInfo: "PatternGame"
  },
  "6-5": {
    classId: "6",
    title: "Logic: Maze Basics",
    explanation: "Combine sequences, directions, and step-by-step thinking to escape the maze.",
    example: "while not_at_goal():\n    step_forward()",
    gameInfo: "MazeGame"
  },
  "7-1": {
    classId: "7",
    title: "Loops: Code Builder",
    explanation: "Build structures efficiently by placing blocks in loops.",
    example: "for(let i=0; i<5; i++) {\n  placeBlock();\n}",
    gameInfo: "BuilderGame"
  },
  "7-2": {
    classId: "7",
    title: "Conditionals: Traffic",
    explanation: "If-Else statements help computers make decisions based on conditions.",
    example: "if (light == 'red') {\n  stop();\n} else {\n  go();\n}",
    gameInfo: "TrafficGame"
  },
  "7-3": {
    classId: "7",
    title: "Debugging",
    explanation: "Bugs are errors in logic. Find and fix the broken code to make the machine work.",
    example: "// Expected outcome: 10\nlet x = 5;\n// BUG: x = x - 5;\nx = x + 5; // FIX",
    gameInfo: "DebugGame"
  },
  "7-4": {
    classId: "7",
    title: "While Loops: Robot Factory",
    explanation: "While loops continue to run as long as a condition is true.",
    example: "while (battery > 0) {\n  work();\n}",
    gameInfo: "FactoryGame"
  },
  "7-5": {
    classId: "7",
    title: "Path Finding: Treasure Hunt",
    explanation: "Use conditions and loops to create a search algorithm to find the hidden treasure.",
    example: "if(pathClear) move();\nelse turn();",
    gameInfo: "TreasureGame"
  }
};

export default function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const levelId = unwrappedParams.id;
  const router = useRouter();
  const { completeLevel } = useProgress();
  
  const [phase, setPhase] = useState("theory"); // 'theory' | 'game' | 'completed'
  
  const levelInfo = LEVEL_DATA[levelId] || {
    classId: levelId.split("-")[0],
    title: "Generic Level",
    explanation: "Proceed to play.",
    example: "// no specific logic",
    gameInfo: "Generic"
  };

  const handleStartGame = () => {
    setPhase("game");
  };

  const handleGameComplete = (starsScored) => {
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
