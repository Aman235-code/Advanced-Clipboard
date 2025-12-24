import React, { useState } from "react";
import { useClipboard } from "../context/ClipboardContext";
import FolderItem from "./FolderItem";
import { Plus, Search, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { folders, addFolder } = useClipboard();
  const [search, setSearch] = useState("");

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-72 p-4 bg-[#020617] border-r border-white/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Folder size={20} className="text-indigo-400" />
        <h2 className="font-semibold text-lg">Clipboard</h2>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search folders..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0f172a] text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Add Folder */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => addFolder("New Folder")}
        className="w-full flex items-center justify-center gap-2 mb-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
      >
        <Plus size={16} />
        New Folder
      </motion.button>

      {/* Folder List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredFolders.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-500 text-center mt-10"
            >
              No folders found
            </motion.p>
          )}

          {filteredFolders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FolderItem folder={folder} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
