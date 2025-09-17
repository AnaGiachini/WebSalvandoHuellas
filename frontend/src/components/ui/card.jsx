import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`border rounded-lg shadow p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="font-bold text-lg mb-2">{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-semibold leading-none ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="mt-4 border-t pt-2">{children}</div>;
}

