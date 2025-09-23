import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../components/auth/AuthProvider";
import userService from "../services/userService";
import { useToast } from "../hooks/useToast";

function initials(name, apellido) {
  const a = (name || "").trim().charAt(0).toUpperCase();
  const b = (apellido || "").trim().charAt(0).toUpperCase();
  return (a + b) || "U";
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await userService.me();
        if (!mounted) return;
        setMe(data);
      } catch (err) {
        const msg = err?.response?.data?.message || "No pudimos cargar tu perfil";
        toast({ title: "Error", description: msg });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  // Datos mostrados: preferimos los del backend (me), con fallback a lo que haya en contexto
  const nombre = me?.nombre ?? user?.name ?? user?.nombre ?? "";
  const apellido = me?.apellido ?? user?.apellido ?? "";
  const email = me?.email ?? user?.email ?? user?.correo ?? "";
  const rol = me?.rol ?? user?.rol ?? "user";
  const direccion = me?.direccion ?? "";
  const telefono = me?.telefono ?? "";

  return (
    <div className="container py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
              {initials(nombre, apellido)}
            </div>
            <div>
              <div className="text-lg font-semibold">
                {nombre || apellido ? `${[nombre, apellido].filter(Boolean).join(" ")}` : "Usuario"}
              </div>
              <div className="text-sm text-muted-foreground">{email || "(email no disponible)"}</div>
            </div>
          </div>

          <Separator className="my-6" />

          {loading ? (
            <div className="text-sm text-muted-foreground">Cargando perfil...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Nombre</div>
                <div className="mt-1">{nombre || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Apellido</div>
                <div className="mt-1">{apellido || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Correo</div>
                <div className="mt-1">{email || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Rol</div>
                <div className="mt-1">{rol}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Dirección</div>
                <div className="mt-1">{direccion || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Teléfono</div>
                <div className="mt-1">{telefono || "—"}</div>
              </div>
            </div>
          )}

          {!loading && (!nombre || !apellido) ? (
            <div className="mt-6 text-sm text-amber-600">
              Algunos datos están incompletos. Más adelante agregaremos edición de perfil para completarlos.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
