/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from "react";

const ClipboardContext = createContext();

const STORAGE_KEY = "advanced-clipboard";

export const ClipboardProvider = ({ children }) => {
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeFile, setActiveFile] = useState(null);

  /* ---------------- Persist ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  /* --------- 🔥 MIGRATE OLD STRING DATA --------- */
  useEffect(() => {
    setFolders((prev) =>
      prev.map((folder) => ({
        ...folder,
        files: folder.files.map((file) => ({
          ...file,
          content: Array.isArray(file.content)
            ? file.content
            : file.content
            ? [{ id: uuid(), text: file.content }]
            : [],
        })),
      }))
    );
  }, []);

  /* ---------------- FOLDER ---------------- */
  const addFolder = (name) => {
    setFolders([...folders, { id: uuid(), name, files: [] }]);
  };

  const renameFolder = (folderId, name) => {
    setFolders(
      folders.map((f) => (f.id === folderId ? { ...f, name } : f))
    );
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter((f) => f.id !== folderId));
    if (activeFile && folders.find(f => f.id === folderId)?.files.some(fl => fl.id === activeFile.id)) {
      setActiveFile(null);
    }
  };

  /* ---------------- FILE ---------------- */
  const addFile = (folderId, name = "New File") => {
    setFolders(
      folders.map((f) =>
        f.id === folderId
          ? {
              ...f,
              files: [
                ...f.files,
                {
                  id: uuid(),
                  name,
                  content: [], // ✅ ALWAYS ARRAY
                },
              ],
            }
          : f
      )
    );
  };

  const deleteFile = (folderId, fileId) => {
    setFolders(
      folders.map((f) =>
        f.id === folderId
          ? { ...f, files: f.files.filter((file) => file.id !== fileId) }
          : f
      )
    );
    if (activeFile?.id === fileId) setActiveFile(null);
  };

  const renameFile = (fileId, name) => {
    setFolders(
      folders.map((f) => ({
        ...f,
        files: f.files.map((file) =>
          file.id === fileId ? { ...file, name } : file
        ),
      }))
    );

    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, name });
    }
  };

  const updateFileContent = (fileId, content) => {
    setFolders(
      folders.map((f) => ({
        ...f,
        files: f.files.map((file) =>
          file.id === fileId ? { ...file, content } : file
        ),
      }))
    );

    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, content });
    }
  };

  return (
    <ClipboardContext.Provider
      value={{
        folders,
        addFolder,
        deleteFolder,
        renameFolder,
        addFile,
        deleteFile,
        renameFile,
        activeFile,
        setActiveFile,
        updateFileContent,
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = () => useContext(ClipboardContext);
