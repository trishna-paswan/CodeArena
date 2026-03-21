"use client";

import { motion } from "framer-motion";

export default function LevelNode({ level, status, x, y, onClick, isCurrent }) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isUnlocked = status === "unlocked";

  let nodeColor = "bg-slate-700 border-slate-600";
  let icon = "🔒";
  
  if (isCompleted) {
    nodeColor = "bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
    icon = "⭐";
  } else if (isUnlocked) {
    nodeColor = "bg-amber-400 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.8)]";
    icon = "▶️";
  }

  return (
    <motion.div
      className={`absolute w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl z-20 cursor-pointer ${nodeColor}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      whileHover={!isLocked ? { scale: 1.15 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      onClick={() => {
        if (!isLocked) onClick(level);
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: level.id * 0.1, type: "spring" }}
    >
      {icon}
      
      {/* Current Player Indicator */}
      {isCurrent && (
        <motion.div 
          className="absolute -top-10 w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-xl overflow-hidden z-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-10 h-10 object-cover" />
        </motion.div>
      )}
      
      {/* Level Number */}
      <div className="absolute -bottom-6 text-white font-bold text-sm bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {level.name || `Level ${level.id}`}
      </div>
    </motion.div>
  );
}
