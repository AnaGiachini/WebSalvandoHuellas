import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import authService from "../../services/authService";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, [location.search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Token faltante", description: "Abre el enlace recibido o pega el token." });
      return;
    }
    if (pass.length < 8) {
      toast({ title: "Contraseña insegura", description: "Mínimo 8 caracteres." });
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, nuevaContrasena: pass });
      toast({ title: "Actualizada", description: "Tu contraseña fue restablecida." });
      navigate("/login");
    } catch (err) {
      const description = err?.response?.data?.message || "Error al restablecer.";
      toast({ title: "Error", description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 md:py-24 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {!token && (
          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <Input
              id="token"
              placeholder="Pega el token del enlace"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Restablecer contraseña"}
        </Button>
      </form>
    </div>
  );
}
