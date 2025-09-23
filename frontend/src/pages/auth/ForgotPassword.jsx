import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import authService from "../../services/authService";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [devLink, setDevLink] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { message, resetLink } = await authService.forgotPassword(email.trim().toLowerCase());
      toast({ title: "Listo", description: message });
      if (resetLink) setDevLink(resetLink);
    } catch (err) {
      const description = err?.response?.data?.message || "Ocurrió un error.";
      toast({ title: "Error", description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 md:py-24 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>

      {devLink && (
        <div className="mt-6 p-3 rounded border text-sm">
          <div className="font-medium mb-1">Enlace de reseteo (solo dev):</div>
          <a className="text-primary underline break-all" href={devLink}>
            {devLink}
          </a>
        </div>
      )}
    </div>
  );
}
