"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export default function ClassCard({ id, title, description, colorClass }) {
  return (
    <Link href={`/class/${id}`}>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer relative overflow-hidden group`}
        style={{ minHeight: "200px" }}
      >
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-40 bg-[#8A2BE2] group-hover:bg-[#9370DB] group-hover:opacity-70 transition-colors duration-500`}></div>
        <div className="flex flex-col h-full justify-between relative z-10">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 font-medium">{description}</p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9370DB] to-[#8A2BE2] uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity neon-text">
              Start Journey
            </span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#8A2BE2] opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(138,43,226,0.6)]`}>
              <Play fill="white" size={18} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
