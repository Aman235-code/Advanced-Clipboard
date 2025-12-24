/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clipboard,
  ChevronDown,
  Settings,
  Keyboard,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useClipboard } from "../context/ClipboardContext";

export default function Header() {
  const { activeFile } = useClipboard();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#020617]/80 backdrop-blur"
    >
      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10">
            <Clipboard size={18} className="text-indigo-400" />
          </div>
          <h1 className="font-semibold tracking-tight">
            Advanced Clipboard
          </h1>
        </div>

        {/* Breadcrumb */}
        {activeFile && (
          <div className="text-sm text-slate-400 flex items-center gap-1">
            <span>{activeFile.folderName}</span>
            <span className="opacity-50">/</span>
            <span className="text-slate-200 font-medium">
              {activeFile.name}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Shortcut hint */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-md">
          <Keyboard size={14} />
          <span>Ctrl + V</span>
        </div>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5"
          >
            {/* <Settings size={16} /> */}
            {/* <ChevronDown size={14} /> */}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 mt-2 w-44 rounded-lg bg-[#020617] border border-white/10 shadow-lg overflow-hidden"
              >
                <div className="p-3 border-b border-white/10 text-xs text-slate-400">
                  Settings
                </div>

                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>

                {/* future options */}
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                  Clear All Clipboards
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
