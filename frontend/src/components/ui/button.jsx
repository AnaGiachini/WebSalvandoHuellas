import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded bg-primary text-white hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
