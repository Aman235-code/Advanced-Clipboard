import React from "react";
import Sidebar from "../components/Sidebar";
import ClipboardEditor from "../components/ClipboardEditor";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ClipboardEditor />
      </div>
    </div>
  );
}
