/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Trash2, Pencil } from "lucide-react";
import { useClipboard } from "../context/ClipboardContext";

export default function FileItem({ file, folderId }) {
  const { setActiveFile, deleteFile, renameFile } = useClipboard();

  const [editing, setEditing] = useState(!file.name);
  const [name, setName] = useState(file.name);

  const saveName = () => {
    renameFile(file.id, name || "Untitled File");
    setEditing(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-white/5 group cursor-pointer"
      onClick={() => setActiveFile(file)}
    >
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-slate-400" />

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
          <span className="text-xs">{file.name}</span>
        )}
      </div>

      <div
        className="flex gap-2 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil size={12} onClick={() => setEditing(true)} />
        <Trash2
          size={12}
          className="text-red-400"
          onClick={() => deleteFile(folderId, file.id)}
        />
      </div>
    </motion.div>
  );
}
