import React from "react";
import { useToast } from "../../hooks/useToast";

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  const openToasts = (toasts || []).filter((t) => t.open !== false);
  if (openToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[320px] max-w-[90vw]">
      {openToasts.map((t) => (
        <div
          key={t.id}
          className="rounded-md border bg-white shadow-lg p-4 text-sm animate-in fade-in-0 zoom-in-95"
          role="status"
          aria-live="polite"
        >
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          {t.description && (
            <div className="text-muted-foreground mb-2">{t.description}</div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => dismiss(t.id)}
              className="text-xs text-primary hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
