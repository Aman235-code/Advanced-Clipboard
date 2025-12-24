import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClipboardProvider } from "./context/ClipboardContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClipboardProvider>
    <App />
  </ClipboardProvider>
);
