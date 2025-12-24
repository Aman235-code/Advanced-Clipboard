import React from "react";
import { motion } from "framer-motion";
import { Clipboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#020617]/80 backdrop-blur"
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10">
          <Clipboard size={18} className="text-indigo-400" />
        </div>
        <h1 className="font-semibold tracking-tight">Advanced Clipboard</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
