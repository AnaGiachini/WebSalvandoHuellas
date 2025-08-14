import React from "react";

export function Checkbox({ className = "", ...props }) {
  return (
    <input
      type="checkbox"
      className={`w-4 h-4 accent-primary ${className}`}
      {...props}
    />
  );
}
