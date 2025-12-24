/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

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

  /* --------- MIGRATE OLD STRING CONTENT --------- */
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

  /* ---------------- SELECT FILE (IMPORTANT) ---------------- */
  const selectActiveFile = (folderId, file) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    setActiveFile({
      ...file,
      folderId,
      folderName: folder.name,
    });
  };

  /* ---------------- FOLDER ---------------- */
  const addFolder = (name = "New Folder") => {
    setFolders([...folders, { id: uuid(), name, files: [] }]);
  };

  const renameFolder = (folderId, name) => {
    setFolders(
      folders.map((f) => (f.id === folderId ? { ...f, name } : f))
    );

    if (activeFile?.folderId === folderId) {
      setActiveFile({ ...activeFile, folderName: name });
    }
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter((f) => f.id !== folderId));
    if (activeFile?.folderId === folderId) setActiveFile(null);
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
                  content: [],
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

  /* ---------------- CLIPBOARD ITEMS ---------------- */
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
        activeFile,

        addFolder,
        renameFolder,
        deleteFolder,

        addFile,
        deleteFile,
        renameFile,

        selectActiveFile, // ✅ USE THIS, NOT setActiveFile
        updateFileContent,
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = () => useContext(ClipboardContext);
