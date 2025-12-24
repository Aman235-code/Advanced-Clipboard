/* eslint-disable react-hooks/set-state-in-effect */
import FileItem from "./FileItem";
import { useClipboard } from "../context/ClipboardContext";
import React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  Folder,
} from "lucide-react";

export default function FolderItem({ folder }) {
  const { renameFolder, deleteFolder, addFile } = useClipboard();

  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(!folder.name);
  const [name, setName] = useState(folder.name);

  useEffect(() => {
    if (!folder.name) setEditing(true);
  }, [folder.name]);

  const saveName = () => {
    renameFolder(folder.id, name || "Untitled Folder");
    setEditing(false);
  };

  return (
    <div className="rounded-lg bg-[#020617] border border-white/10">
      {/* Folder Header */}
      <div className="flex items-center justify-between px-3 py-2 group">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <Folder size={16} className="text-indigo-400" />

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="bg-transparent border-b border-indigo-400 outline-none text-sm w-32"
            />
          ) : (
            <span className="text-sm">{folder.name}</span>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <Plus
            size={14}
            onClick={() => addFile(folder.id)}
            className="cursor-pointer"
          />
          <Pencil
            size={14}
            onClick={() => setEditing(true)}
            className="cursor-pointer"
          />
          <Trash2
            size={14}
            onClick={() => deleteFolder(folder.id)}
            className="cursor-pointer text-red-400"
          />
        </div>
      </div>

      {/* Files */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 pb-2 space-y-1 overflow-hidden"
          >
            {folder.files.map((file) => (
              <FileItem key={file.id} file={file} folderId={folder.id} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
