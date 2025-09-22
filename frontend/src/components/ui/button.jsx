// src/components/ui/button.jsx
import React from "react";

export function Button({ children, variant, className, ...props }) {
  let base = "px-4 py-2 rounded font-medium text-white transition-colors";
  if (variant === "outline") base += " border border-gray-500 bg-transparent hover:bg-gray-800";
  else if (variant === "link") base += " bg-transparent text-yellow-400 hover:underline";
  else base += " bg-yellow-400 hover:bg-yellow-500";

  return (
    <button className={`${base} ${className || ""}`} {...props}>
      {children}
    </button>
  );
}
