// src/components/ui/image.jsx
import React from "react";

export function Image({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}
