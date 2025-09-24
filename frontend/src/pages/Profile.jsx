import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../components/auth/AuthProvider";
import userService from "../services/userService";
import { useToast } from "../hooks/useToast";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

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
  const [saving, setSaving] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await userService.me();
        if (!mounted) return;
        setMe(data);
        setDireccion(data?.direccion || "");
        setTelefono(data?.telefono || "");
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!me?.idUsuario) {
      toast({ title: "Error", description: "No pudimos identificar tu usuario." });
      return;
    }
    setSaving(true);
    try {
      await userService.update(me.idUsuario, { direccion: direccion?.trim(), telefono: telefono?.trim() });
      toast({ title: "Perfil actualizado", description: "Tus datos se guardaron correctamente." });
      // Refrescar datos
      const data = await userService.me();
      setMe(data);
      setDireccion(data?.direccion || "");
      setTelefono(data?.telefono || "");
    } catch (err) {
      const msg = err?.response?.data?.message || "No pudimos guardar tus cambios";
      toast({ title: "Error", description: msg });
    } finally {
      setSaving(false);
    }
  };

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
            <>
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
              </div>

              <Separator className="my-6" />

              <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle 123, Ciudad" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
                </div>
              </form>
            </>
          )}

          {!loading && (!nombre || !apellido) ? (
            <div className="mt-6 text-sm text-amber-600">
              Algunos datos están incompletos. Por favor, completa tu información.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
