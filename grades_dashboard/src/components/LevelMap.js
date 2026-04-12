"use client";

import { motion } from "framer-motion";
import LevelNode from "./LevelNode";

export default function LevelMap({ levels, userProgress, onLevelSelect }) {
  // Generate beautiful flowing coordinates for the map path
  const points = levels.map((_, index) => {
    // Start at bottom (90%) and climb to top (10%)
    const yTarget = 85 - (index * (75 / Math.max(1, levels.length - 1)));
    const xBase = 50;
    // Elegant sweeping sine curve
    const xOffset = Math.sin(index * 1.5) * 35; 
    return { x: xBase + xOffset, y: yTarget };
  });

  const getStatus = (levelId) => {
    if (userProgress.completedLevels.includes(levelId)) return "completed";
    if (userProgress.unlockedLevels.includes(levelId)) return "unlocked";
    return "locked";
  };

  return (
    <div className="relative w-full max-w-lg mx-auto h-[75vh] min-h-[600px] bg-slate-900/60 rounded-[3rem] border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden glass-panel">
      <div className="absolute inset-0 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="relative w-full h-[1200px] md:h-full">
          
          {/* Dynamic SVG Connection Line overlay using percentage coordinates */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {points.map((pt, i) => {
              if (i === 0) return null;
              const prevPt = points[i - 1];
              
              const levelStatus = getStatus(levels[i].id);
              const prevStatus = getStatus(levels[i-1].id);
              
              // Only light up path if we have unlocked both connecting nodes
              const isPathUnlocked = (prevStatus === 'completed' || prevStatus === 'unlocked') && (levelStatus === 'unlocked' || levelStatus === 'completed');
              
              return (
                <path
                  key={`path-${i}`}
                  // Smooth Bezier Curve between coordinates
                  d={`M ${prevPt.x} ${prevPt.y} C ${prevPt.x} ${prevPt.y - (prevPt.y - pt.y)/2}, ${pt.x} ${pt.y + (prevPt.y - pt.y)/2}, ${pt.x} ${pt.y}`}
                  stroke={isPathUnlocked ? "rgba(139, 92, 246, 0.8)" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={isPathUnlocked ? "1.5" : "0.5"}
                  strokeDasharray={isPathUnlocked ? "none" : "2, 2"}
                  fill="transparent"
                  style={{ filter: isPathUnlocked ? "drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.8))" : "none" }}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Render Nodes */}
          {levels.map((level, i) => {
            const status = getStatus(level.id);
            const isCurrent = Math.max(...userProgress.unlockedLevels.map(id => parseInt(id.replace('-','')))) === parseInt(level.id.replace('-',''));
            // Since IDs are string "6-1", parseInt replaces gives 61 vs 62.

            return (
              <LevelNode
                key={level.id}
                level={level}
                status={status}
                x={points[i].x}
                y={points[i].y}
                onClick={onLevelSelect}
                isCurrent={isCurrent}
                index={i}
              />
            );
          })}
        </div>
      </div>
      
      {/* Sleek bottom shadow gradient to emulate fog layer */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900/80 to-transparent pointer-events-none rounded-t-[3rem]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-[3rem]"></div>
    </div>
  );
}
