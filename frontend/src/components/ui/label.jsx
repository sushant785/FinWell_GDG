// src/components/ui/label.jsx
import React from "react";

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">
      {children}
    </label>
  );
}
