// src/components/ui/table.jsx
import React from "react";

export function Table({ children, className = "" }) {
  return (
    <table className={`w-full border-collapse text-sm ${className}`}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-gray-100 text-gray-700 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return <tr className={`border-b last:border-none ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-2 text-left font-medium text-gray-900 ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}

export function TableCaption({ children, className = "" }) {
  return (
    <caption className={`mt-2 text-sm text-gray-500 ${className}`}>
      {children}
    </caption>
  );
}
