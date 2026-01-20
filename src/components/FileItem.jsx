/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Pencil, AlertTriangle } from "lucide-react";
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
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isActive = activeFile?.id === file.id;

  const saveName = () => {
    renameFile(file.id, name.trim() || "Untitled File");
    setEditing(false);
  };

  return (
    <>
      {/* File Row */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => selectActiveFile(folderId, file)}
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer group transition border
          ${
            isActive
              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#020617] border-white/10 hover:bg-white/5 text-slate-300"
          }`}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-1.5 rounded-lg ${
              isActive ? "bg-indigo-500/20" : "bg-white/5"
            }`}
          >
            <FileText
              size={16}
              className={isActive ? "text-indigo-400" : "text-slate-400"}
            />
          </div>

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent border-b border-indigo-400 outline-none text-sm w-40"
            />
          ) : (
            <span className="text-sm truncate">{file.name}</span>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 opacity-0 group-hover:opacity-100 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil
            size={14}
            className="hover:text-indigo-400"
            onClick={() => setEditing(true)}
          />
          <Trash2
            size={14}
            className="text-red-400 hover:text-red-300"
            onClick={() => setConfirmDelete(true)}
          />
        </div>
      </motion.div>

      {/* Centered Delete Modal */}
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
                    Delete File
                  </h3>
                </div>

                <p className="text-sm text-slate-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-slate-200 font-medium">
                    {file.name}
                  </span>
                  ? This action cannot be undone.
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
                      deleteFile(folderId, file.id);
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
