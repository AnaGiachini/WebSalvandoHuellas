// src/components/ui/separator.jsx
import React from "react";

export function Separator({ className = "" }) {
  return (
    <div
      className={`w-full h-px bg-gray-200 dark:bg-gray-700 my-4 ${className}`}
    />
  );
}
