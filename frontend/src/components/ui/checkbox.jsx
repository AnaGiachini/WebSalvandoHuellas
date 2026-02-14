import React from "react";

export function Checkbox({ className = "", onCheckedChange, onChange, ...props }) {
  const handleChange = (event) => {
    // Disparar handler estándar si se pasó
    if (typeof onChange === "function") {
      onChange(event);
    }
    // Compatibilidad con API tipo shadcn: onCheckedChange(boolean)
    if (typeof onCheckedChange === "function") {
      onCheckedChange(event.target.checked);
    }
  };

  return (
    <input
      type="checkbox"
      className={`w-4 h-4 accent-primary ${className}`}
      onChange={handleChange}
      {...props}
    />
  );
}
