"use client";

import { motion } from "framer-motion";

export default function LevelNode({ level, status, x, y, onClick, isCurrent, index }) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isUnlocked = status === "unlocked";

  let nodeColor = "bg-slate-800/80 border-slate-700 text-slate-500 shadow-md";
  let glowEffect = "";
  let InnerIcon = () => <div className="w-4 h-4 rounded-full bg-slate-600 shadow-inner"></div>;
  
  if (isCompleted) {
    nodeColor = "bg-indigo-900/40 border-violet-500 text-violet-300";
    glowEffect = "shadow-[0_0_25px_rgba(139,92,246,0.5)]";
    InnerIcon = () => (
      <div className="w-5 h-5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,1)]"></div>
    );
  } else if (isUnlocked) {
    nodeColor = "bg-amber-900/40 border-amber-400 text-amber-300";
    glowEffect = "shadow-[0_0_30px_rgba(251,191,36,0.6)] box-shadow-animate";
    InnerIcon = () => (
      <div className="w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)] animate-pulse"></div>
    );
  }

  // Use a string or SVG if the user wants purely geometric
  return (
    <motion.div
      className={`absolute w-16 h-16 rounded-full border-[3px] flex items-center justify-center z-20 backdrop-blur-md cursor-pointer ${nodeColor} ${glowEffect}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      whileHover={!isLocked ? { scale: 1.2 } : {}}
      whileTap={!isLocked ? { scale: 0.9 } : {}}
      onClick={() => {
        if (!isLocked) onClick(level);
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
    >
      <InnerIcon />
      
      {/* Current Player Avatar Indicator */}
      {isCurrent && (
        <motion.div 
          className="absolute -top-12 w-14 h-14 bg-slate-800/90 rounded-full flex items-center justify-center border-2 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.6)] overflow-hidden z-30 backdrop-blur-xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-[110%] h-[110%] object-cover" />
        </motion.div>
      )}
      
      {/* Sleek Dark Neon Level Label */}
      <div className="absolute top-[110%] whitespace-nowrap text-slate-200 font-bold text-xs bg-slate-900/80 border border-slate-700/50 px-3 py-1 rounded-full backdrop-blur-md shadow-lg">
        {level.name || `Level ${level.id}`}
      </div>
    </motion.div>
  );
}
