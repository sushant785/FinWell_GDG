// src/components/ui/progress.jsx
import React from "react";

export function Progress({ value, className }) {
  return (
    <div className={`w-full bg-gray-700 rounded-full h-3 ${className || ""}`}>
      <div
        className="bg-yellow-400 h-3 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
