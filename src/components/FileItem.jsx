/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Trash2, Pencil } from "lucide-react";
import { useClipboard } from "../context/ClipboardContext";

export default function FileItem({ file, folderId }) {
  const {
    selectActiveFile,
    deleteFile,
    renameFile,
    activeFile,
  } = useClipboard();

  const [editing, setEditing] = useState(!file.name);
  const [name, setName] = useState(file.name || "");

  const isActive = activeFile?.id === file.id;

  const saveName = () => {
    renameFile(file.id, name.trim() || "Untitled File");
    setEditing(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => selectActiveFile(folderId, file)}
      className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer group
        ${
          isActive
            ? "bg-indigo-500/20 text-indigo-300"
            : "hover:bg-white/5"
        }`}
    >
      {/* Left */}
      <div className="flex items-center gap-2 truncate">
        <FileText size={14} className="text-slate-400 shrink-0" />

        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            className="bg-transparent border-b border-indigo-400 outline-none text-xs w-28"
          />
        ) : (
          <span className="text-xs truncate">{file.name}</span>
        )}
      </div>

      {/* Right actions */}
      <div
        className="flex gap-2 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          size={12}
          className="hover:text-indigo-400"
          onClick={() => setEditing(true)}
        />
        <Trash2
          size={12}
          className="text-red-400 hover:text-red-300"
          onClick={() => deleteFile(folderId, file.id)}
        />
      </div>
    </motion.div>
  );
}
