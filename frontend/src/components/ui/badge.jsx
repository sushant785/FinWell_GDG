// src/components/ui/badge.jsx
import React from "react";

export function Badge({ children, variant, className }) {
  let base = "inline-flex items-center px-2 py-1 rounded text-xs font-semibold";
  if (variant === "secondary") base += " bg-blue-500 text-white";
  else if (variant === "destructive") base += " bg-red-500 text-white";
  else if (variant === "outline") base += " border border-gray-500 text-white";
  else base += " bg-gray-700 text-white";

  return <span className={`${base} ${className || ""}`}>{children}</span>;
}
