import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Reemplazo de useRouter
import { Button } from "../ui/button"; // Ajusta la ruta según tu estructura
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "./AuthProvider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  /**
   * Maneja el envío del formulario de inicio de sesión (UC02)
   * --------------------------------------------------------------------------
   * - Valida que email y contraseña cumplan los requisitos mínimos
   * - Normaliza el email antes de enviarlo al backend
   * - Muestra mensajes claros según el tipo de error devuelto por la API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones frontend: mejoran la UX antes de llegar al backend
    if (!email.trim()) {
      toast({ 
        title: "Email requerido", 
        description: "Por favor ingresa tu correo electrónico.",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({ 
        title: "Contraseña requerida", 
        description: "Por favor ingresa tu contraseña.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({ 
        title: "Contraseña muy corta", 
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Normalización del email (coherente con el backend)
      const normalizedEmail = email.trim().toLowerCase();

      await login(normalizedEmail, password);

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      });
      let storedFrom = null;
      try {
        storedFrom = localStorage.getItem("postLoginRedirect");
        if (storedFrom) {
          localStorage.removeItem("postLoginRedirect");
        }
      } catch (_e) {
        storedFrom = null;
      }

      let from = location.state?.from || storedFrom || "/";
      if (from === "/login" || from === "/register") {
        from = "/";
      }
      navigate(from, { replace: true });
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      const message = err?.response?.data?.message;
      let title = "Error al iniciar sesión";
      let description = "Revisa tus credenciales e inténtalo nuevamente.";

      // Manejo específico de errores
      if (message) {
        if (message.includes("Credenciales inválidas")) {
          title = "Credenciales incorrectas";
          description = "El correo o la contraseña son incorrectos. Por favor, verifica tus datos.";
        } else {
          description = message;
        }
      }

      // Errores de validación del backend
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        description = backendErrors
          .map((e) => e?.msg || e?.message)
          .filter(Boolean)
          .join(". ");
      }

      toast({ title, description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-primary"
            type="button"
            onClick={() => navigate('/auth/forgot')}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
