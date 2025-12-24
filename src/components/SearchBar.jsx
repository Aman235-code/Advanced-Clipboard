import React from "react";
export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="w-full mb-3 px-3 py-2 rounded bg-[#0f172a]"
    />
  );
}
