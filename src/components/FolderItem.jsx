/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  Folder,
  AlertTriangle,
} from "lucide-react";
import { useClipboard } from "../context/ClipboardContext";
import FileItem from "./FileItem";

export default function FolderItem({ folder }) {
  const { renameFolder, deleteFolder, addFile } = useClipboard();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(!folder.name);
  const [name, setName] = useState(folder.name || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!folder.name) setEditing(true);
  }, [folder.name]);

  const saveName = () => {
    renameFolder(folder.id, name.trim() || "Untitled Folder");
    setEditing(false);
  };

  return (
    <>
      <div className="rounded-xl bg-[#020617] border border-white/10 overflow-hidden">
        {/* Folder Header */}
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center justify-between px-3 py-2 cursor-pointer group hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-2 min-w-0">
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400"
            >
              <ChevronRight size={16} />
            </motion.span>

            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <Folder size={16} className="text-indigo-400 shrink-0" />
            </div>

            {editing ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b border-indigo-400 outline-none text-sm w-36 text-slate-200"
              />
            ) : (
              <span className="text-sm text-slate-200 truncate">
                {folder.name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div
            className="flex gap-2 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus
              size={14}
              onClick={() => addFile(folder.id)}
              className="hover:text-indigo-400"
            />
            <Pencil
              size={14}
              onClick={() => setEditing(true)}
              className="hover:text-indigo-400"
            />
            <Trash2
              size={14}
              onClick={() => setConfirmDelete(true)}
              className="text-red-400 hover:text-red-300"
            />
          </div>
        </div>

        {/* Files */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pl-8 pr-2 pb-2"
            >
              <div className="max-h-56 overflow-y-auto space-y-1 sidebar-scroll">
                {folder.files.length === 0 && (
                  <p className="text-xs text-slate-500 py-2">
                    Empty folder
                  </p>
                )}

                {folder.files.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    folderId={folder.id}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Folder Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="w-full max-w-sm rounded-2xl bg-[#020617] border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-red-500/10">
                    <AlertTriangle className="text-red-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200">
                    Delete Folder
                  </h3>
                </div>

                <p className="text-sm text-slate-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-slate-200 font-medium">
                    {folder.name}
                  </span>
                  ? All files inside will be removed.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteFolder(folder.id);
                      setConfirmDelete(false);
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
