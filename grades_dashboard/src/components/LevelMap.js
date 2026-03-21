"use client";

import { motion } from "framer-motion";
import LevelNode from "./LevelNode";

// A curved SVG path to simulate a Candy Crush style map
const MapPath = () => (
  <svg className="absolute w-full h-[150%] top-0 left-0 -z-10" preserveAspectRatio="none">
    <path 
      d="M 50 100 C 90 200, 10 300, 50 400 C 90 500, 10 600, 50 700 C 90 800, 10 900, 50 1000" 
      stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" fill="transparent" strokeDasharray="15, 15"
    />
  </svg>
);

export default function LevelMap({ levels, userProgress, onLevelSelect }) {
  // Generate a zigzag pattern for nodes computationally
  const points = levels.map((_, index) => {
    // Starting from bottom up
    const yTarget = 90 - (index * (80 / Math.max(1, levels.length - 1)));
    const xBase = 50;
    const xOffset = Math.sin(index * 1.5) * 30; // Creates a wavy pattern between 20% and 80% left
    return { x: xBase + xOffset, y: yTarget };
  });

  return (
    <div className="relative w-full max-w-lg mx-auto h-[80vh] min-h-[600px] bg-slate-900/50 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl glass-panel">
      <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[100px]">
        <div className="relative w-full h-[1200px]">
          <MapPath />
          {levels.map((level, i) => {
            const status = userProgress.completedLevels.includes(level.id) 
              ? "completed" 
              : userProgress.unlockedLevels.includes(level.id) ? "unlocked" : "locked";
              
            const isCurrent = Math.max(...userProgress.unlockedLevels) === level.id;

            return (
              <LevelNode
                key={level.id}
                level={level}
                status={status}
                x={points[i].x}
                y={points[i].y}
                onClick={onLevelSelect}
                isCurrent={isCurrent}
              />
            );
          })}
        </div>
      </div>
      
      {/* Decorative gradient fog at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-3xl"></div>
    </div>
  );
}
