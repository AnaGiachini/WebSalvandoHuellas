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

    // Validaciones frontend
    if (!token) {
      toast({ 
        title: "Token faltante", 
        description: "Abre el enlace recibido por correo o pega el token.",
        variant: "destructive"
      });
      return;
    }

    if (!pass.trim()) {
      toast({ 
        title: "Contraseña requerida", 
        description: "Por favor ingresa una nueva contraseña.",
        variant: "destructive"
      });
      return;
    }

    if (pass.length < 8) {
      toast({ 
        title: "Contraseña insegura", 
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }

    // Validación de complejidad (opcional pero recomendada)
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);

    if (!hasLower || !hasUpper || !hasNumber) {
      toast({ 
        title: "Contraseña débil", 
        description: "Debe incluir mayúscula, minúscula y número.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, nuevaContrasena: pass });
      toast({ 
        title: "Contraseña actualizada", 
        description: "Tu contraseña fue restablecida exitosamente. Puedes iniciar sesión."
      });
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message;
      let description = "Error al restablecer la contraseña.";
      
      if (message) {
        if (message.includes("Token inválido") || message.includes("expirado")) {
          description = "El enlace ha expirado o es inválido. Solicita uno nuevo.";
        } else {
          description = message;
        }
      }
      
      toast({ title: "Error", description, variant: "destructive" });
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
