// src/components/ui/input.jsx
import React from "react";

export function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  );
}
