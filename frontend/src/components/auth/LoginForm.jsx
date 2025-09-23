import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Reemplazo de useRouter
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
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Normalización básica
      const payload = {
        email: email.trim().toLowerCase(),
        password: password,
      };

      await login(payload.email, payload.password);

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      });
      navigate("/");
    } catch (err) {
      const description = err?.response?.data?.message || "Revisa tus credenciales e inténtalo nuevamente.";
      toast({ title: "Error al iniciar sesión", description });
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
