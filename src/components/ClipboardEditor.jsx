/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
  X,
} from "lucide-react";
import { useClipboard } from "../context/ClipboardContext";

export default function ClipboardEditor() {
  const { activeFile, updateFileContent } = useClipboard();

  const [copiedId, setCopiedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Handle paste (Ctrl + V)
  useEffect(() => {
    if (!activeFile) return;

    const onPaste = async () => {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      updateFileContent(activeFile.id, [
        ...activeFile.content,
        { id: crypto.randomUUID(), text },
      ]);
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [activeFile]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a file to view clipboard
      </div>
    );
  }

  const copyItem = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteItem = (id) => {
    updateFileContent(
      activeFile.id,
      activeFile.content.filter((item) => item.id !== id)
    );
    setConfirmDelete(null);
  };

  const clearAll = () => {
    updateFileContent(activeFile.id, []);
    setConfirmClear(false);
  };

  return (
    <div className="flex-1 flex justify-center items-start p-10 overflow-y-auto">
      <motion.div layout className="w-full max-w-3xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">
            {activeFile.name}
          </h2>

          {activeFile.content.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              <Trash2 size={14} />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Clear All confirmation */}
        <AnimatePresence>
          {confirmClear && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl bg-[#020617] border border-white/10 p-4 flex justify-between items-center"
            >
              <span className="text-sm text-slate-300">
                Clear all clipboard items?
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clipboard Items */}
        <AnimatePresence>
          {activeFile.content.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-sm text-center py-16"
            >
              Paste anything here (Ctrl + V)
            </motion.p>
          )}

          {activeFile.content.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl bg-[#0f172a] border border-white/10 p-4 group"
            >
              <div className="flex justify-between gap-4">
                <p className="text-sm whitespace-pre-wrap wrap-break-word text-slate-200">
                  {item.text}
                </p>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  {/* Copy */}
                  <button
                    onClick={() => copyItem(item.text, item.id)}
                    className="hover:text-indigo-400 transition"
                  >
                    {copiedId === item.id ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    className="hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              <AnimatePresence>
                {confirmDelete === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="mt-3 flex justify-between items-center rounded-lg bg-[#020617] border border-white/10 p-3"
                  >
                    <span className="text-xs text-slate-300">
                      Delete this item?
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-2 py-1 text-xs rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
