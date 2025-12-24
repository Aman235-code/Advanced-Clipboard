import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2 } from "lucide-react";
import { useClipboard } from "../context/ClipboardContext";

export default function ClipboardEditor() {
  const {
    activeFile,
    updateFileContent,
  } = useClipboard();

  // Handle paste (Ctrl + V)
  useEffect(() => {
    if (!activeFile) return;

    const onPaste = async (e) => {
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

  const copyItem = (text) => {
    navigator.clipboard.writeText(text);
  };

  const deleteItem = (id) => {
    updateFileContent(
      activeFile.id,
      activeFile.content.filter((item) => item.id !== id)
    );
  };

  const clearAll = () => {
    updateFileContent(activeFile.id, []);
  };

  return (
    <div className="flex-1 flex justify-center items-start p-10 overflow-y-auto">
      <motion.div
        layout
        className="card w-full max-w-3xl p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{activeFile.name}</h2>

          {activeFile.content.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="flex items-center gap-2 text-sm px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 size={14} />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Clipboard Items */}
        <AnimatePresence>
          {activeFile.content.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-sm text-center py-10"
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
                <p className="text-sm whitespace-pre-wrap break-words">
                  {item.text}
                </p>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => copyItem(item.text)}
                    className="hover:text-indigo-400"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
