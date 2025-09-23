import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../hooks/useToast";
import adoptionApplicationsService from "../services/adoptionApplicationsService";

export default function AdoptionForm({ animalId, animalName, disabled = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    setIsSubmitting(true);
    try {
      // El backend solo requiere idAnimal (idUsuario viene del token)
      await adoptionApplicationsService.create({ idAnimal: animalId });

      toast({
        title: "Solicitud enviada",
        description: `Tu solicitud para adoptar a ${animalName} ha sido registrada. Te contactaremos pronto.`,
      });

      e.target.reset();
    } catch (err) {
      const description =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No pudimos enviar tu solicitud. Intenta nuevamente.";
      toast({ title: "Error en la solicitud", description });
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
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" disabled={disabled || isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" disabled={disabled || isSubmitting} />
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
