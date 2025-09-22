// src/components/ui/tabs.jsx
import React, { useState } from "react";

export function Tabs({ children, defaultValue }) {
  const [active, setActive] = useState(defaultValue);
  return React.Children.map(children, child => React.cloneElement(child, { active, setActive }));
}

export function TabsList({ children }) {
  return <div className="flex border-b border-gray-700 mb-4">{children}</div>;
}

export function TabsTrigger({ children, value, active, setActive }) {
  const isActive = active === value;
  return (
    <button
      className={`px-4 py-2 font-medium ${isActive ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"}`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, active }) {
  return active === value ? <div>{children}</div> : null;
}
