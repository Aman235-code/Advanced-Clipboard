import React from "react";
export default function ThemeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
  };

  return <button onClick={toggle}>🌙</button>;
}
