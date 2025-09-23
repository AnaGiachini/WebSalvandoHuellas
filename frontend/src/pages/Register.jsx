import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../components/auth/AuthProvider";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const normalizeName = (str) =>
    (str || "")
      .trim()
      .split(/\s+/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reglas exactas del backend: mín. 8, al menos una minúscula, una mayúscula y un número
    const hasMinLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMinLength || !hasLower || !hasUpper || !hasNumber) {
      toast({
        title: "Contraseña inválida",
        description:
          "Debe tener al menos 8 caracteres e incluir minúscula, mayúscula y número.",
      });
      return;
    }

    if (password !== confirm) {
      toast({ title: "Contraseñas distintas", description: "La confirmación no coincide." });
      return;
    }

    if (!lastName.trim()) {
      toast({ title: "Apellido requerido", description: "Por favor ingresa tu apellido." });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: normalizeName(firstName),
        lastName: normalizeName(lastName),
        email: (email || "").trim().toLowerCase(),
        password,
      };

      await register(payload);

      toast({ title: "Registro exitoso", description: "¡Bienvenida/o a Salvando Huellas!" });
      navigate("/");
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      const message = err?.response?.data?.message;
      let description = message || "No pudimos crear tu cuenta. Intenta nuevamente.";

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        description = backendErrors
          .map((e) => (e?.msg ? `${e.path}: ${e.msg}` : null))
          .filter(Boolean)
          .join(" | ");
      }

      toast({ title: "Error al registrarse", description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 md:py-24 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Regístrate para acceder a todas las funcionalidades de Salvando
              Huellas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Ingresa tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Ingresa tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta? {" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
