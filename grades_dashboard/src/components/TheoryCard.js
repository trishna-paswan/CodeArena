"use client";

import { motion } from "framer-motion";
import { BookOpen, Play } from "lucide-react";

export default function TheoryCard({ title, explanation, example, onStart }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel w-full max-w-2xl mx-auto rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
          <BookOpen className="text-white" size={32} />
        </div>
        
        <h2 className="text-4xl font-extrabold text-white mb-4 text-gradient">{title}</h2>
        
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-6 text-left">
          <p className="text-lg text-slate-200 mb-4 leading-relaxed">{explanation}</p>
          
          <div className="bg-neutral-900/80 rounded-xl p-4 border border-slate-700/50">
            <h4 className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Example / Real world logic</h4>
            <code className="text-sky-400 font-mono block whitespace-pre-wrap">
              {example}
            </code>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold text-xl py-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 transition-shadow hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]"
        >
          <Play fill="white" size={24} />
          <span>PLAY GAME</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
