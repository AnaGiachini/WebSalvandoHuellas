import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../hooks/useToast";

export default function AdoptionForm({ animalName }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío de formulario
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Solicitud enviada",
        description: `Tu solicitud para adoptar a ${animalName} ha sido recibida. Nos pondremos en contacto contigo pronto.`,
      });

      // Resetear el formulario
      e.target.reset();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">
          ¿Has tenido mascotas antes? Cuéntanos tu experiencia
        </Label>
        <Textarea id="experience" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">
          ¿Por qué quieres adoptar a {animalName}?
        </Label>
        <Textarea id="reason" required />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="terms" required />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Acepto los términos y condiciones
          </label>
          <p className="text-sm text-muted-foreground">
            Al enviar este formulario, acepto que mis datos sean utilizados para
            el proceso de adopción.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
