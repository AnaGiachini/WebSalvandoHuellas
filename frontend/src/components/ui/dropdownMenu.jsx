import React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow">
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t my-1"></div>;
}
