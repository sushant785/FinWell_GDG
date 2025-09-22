// src/components/ui/card.jsx
import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function Card({ children, className }) {
  return <div className={`rounded-lg border border-gray-700 bg-gray-900 p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="mt-2 flex flex-col gap-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-bold text-white">{children}</h2>;
}

export function CardDescription({ children }) {
  return <p className="text-sm text-gray-400">{children}</p>;
}
