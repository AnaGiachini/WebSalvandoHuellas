import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../hooks/useToast";
import adoptionApplicationsService from "../services/adoptionApplicationsService";
import userService from "../services/userService";

export default function AdoptionForm({ animalId, animalName, disabled = false, onSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  // Cargar datos de perfil para prellenar y bloquear campos de contacto
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    (async () => {
      try {
        const data = await userService.me();
        setMe(data);
      } catch (err) {
        // Si no puede cargar, se validará igualmente al enviar
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    // Requiere sesión
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Necesitas iniciar sesión", description: "Inicia sesión para enviar una solicitud de adopción." });
      navigate("/login");
      return;
    }

    // Requiere confirmación de datos correctos
    const termsChecked = e.currentTarget?.querySelector('#terms')?.checked;
    if (!termsChecked) {
      toast({ title: "Confirma tus datos", description: "Debes confirmar que tus datos son correctos para continuar." });
      return;
    }

    // Requiere perfil completo (teléfono y dirección) antes de enviar
    try {
      const telefono = me?.telefono?.toString().trim();
      const direccion = me?.direccion?.toString().trim();
      if (!telefono || !direccion) {
        toast({
          title: "Completa tu perfil",
          description: "Necesitamos tu teléfono y dirección antes de enviar la solicitud.",
        });
        navigate("/perfil");
        return;
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "No pudimos validar tu perfil. Inicia sesión nuevamente.";
      toast({ title: "Error de perfil", description: msg });
      if (err?.response?.status === 401) navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      // El backend solo requiere idAnimal (idUsuario viene del token)
      await adoptionApplicationsService.create({ idAnimal: animalId });

      toast({
        title: "Solicitud enviada",
        description: `Tu solicitud por ${animalName} quedó registrada. Te contactaremos pronto.`,
      });

      e.target.reset();
      onSubmitted?.();
      // Redirigir automáticamente a "Mis solicitudes"
      navigate("/mis-solicitudes");
    } catch (err) {
      const description =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No pudimos enviar tu solicitud. Intenta nuevamente.";
      toast({ title: "Error en la solicitud", description });
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" disabled={disabled || isSubmitting} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" disabled={disabled || isSubmitting} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" type="email" disabled={disabled || isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (desde tu perfil)</Label>
        <Input id="phone" type="tel" value={me?.telefono || ""} readOnly disabled={disabled || isSubmitting} />
        <div className="text-xs text-muted-foreground">Para cambiarlo, edita tu <button type="button" className="text-primary underline" onClick={() => navigate('/perfil')}>perfil</button>.</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección (desde tu perfil)</Label>
        <Input id="address" value={me?.direccion || ""} readOnly disabled={disabled || isSubmitting} />
        <div className="text-xs text-muted-foreground">Para cambiarla, edita tu <button type="button" className="text-primary underline" onClick={() => navigate('/perfil')}>perfil</button>.</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">¿Has tenido mascotas antes? Cuéntanos tu experiencia</Label>
        <Textarea id="experience" disabled={disabled || isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">¿Por qué quieres adoptar a {animalName}?</Label>
        <Textarea id="reason" disabled={disabled || isSubmitting} />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="terms" disabled={disabled || isSubmitting} />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Confirmo que mis datos son correctos
          </label>
          <p className="text-sm text-muted-foreground">
            La confirmación final se realizará por el equipo de Salvando Huellas.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={disabled || isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
