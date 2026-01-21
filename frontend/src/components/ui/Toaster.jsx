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
          className="relative rounded-md border bg-white shadow-lg p-4 pr-8 text-sm animate-in fade-in-0 zoom-in-95"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="absolute right-2 top-2 h-4 w-4 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
            aria-label="Cerrar notificación"
          >
            ×
          </button>
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          {t.description && (
            <div className="text-muted-foreground">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
