import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

// Contexto para compartir estado open/cerrar entre Trigger y Content
const Ctx = createContext(null);

export function DropdownMenu({ children, open: openProp, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const anchorRef = useRef(null);
  const containerRef = useRef(null);

  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? openProp : internalOpen;

  const setOpen = useCallback((v) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  }, [isControlled, onOpenChange]);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, setOpen]);

  const value = useMemo(() => ({ open, setOpen, anchorRef }), [open, setOpen]);

  return (
    <Ctx.Provider value={value}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function DropdownMenuTrigger({ children, onClick, asChild }) {
  const { open, setOpen, anchorRef } = useContext(Ctx);
  const handleClick = (e) => {
    onClick?.(e);
    setOpen(!open);
  };
  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ref: (node) => {
        anchorRef.current = node;
        if (typeof children.ref === "function") children.ref(node);
        else if (children.ref) children.ref.current = node;
      },
    });
  }
  return (
    <div ref={anchorRef} onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children, align = "start" }) {
  const { open } = useContext(Ctx);
  if (!open) return null;
  const alignClass = align === "end" ? "right-0" : "left-0";
  return (
    <div className={`absolute ${alignClass} z-50 mt-2 w-48 bg-white border rounded shadow`}> 
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  const { setOpen } = useContext(Ctx);
  const handle = (e) => {
    onClick?.(e);
    // Cierra al seleccionar
    setOpen(false);
  };
  return (
    <div
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={handle}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t my-1"></div>;
}
