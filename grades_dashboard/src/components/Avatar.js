"use client";

import { motion } from "framer-motion";

export default function Avatar({ seed = "Felix", size = "w-10 h-10" }) {
  return (
    <motion.div 
      className={`bg-white rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-xl overflow-hidden z-30 ${size}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      {/* DiceBear Avatar API provides visually appealing, game-like generic avatars */}
      <img 
        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=transparent`} 
        alt="Player Avatar" 
        className="w-full h-full object-cover" 
      />
    </motion.div>
  );
}
