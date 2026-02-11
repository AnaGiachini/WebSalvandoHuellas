/**
 * Componente AdoptionForm
 * ---------------------------------------------------------------------------
 * Formulario principal del UC05: completar formulario de adopción.
 *
 *  • Rol en el flujo
 *      - Se muestra en el detalle de un animal disponible para adopción.
 *      - Toma un snapshot de los datos de contacto del usuario (desde su perfil)
 *        y recoge información adicional (experiencia y motivación).
 *      - Envía la solicitud al backend y redirige a "Mis solicitudes".
 */
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar datos de perfil para prellenar y bloquear campos de contacto
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
    (async () => {
      try {
        const data = await userService.me();
        setMe(data);
      } catch (err) {
        // Si no puede cargar, se validará igualmente al enviar
      }
    })();
  }, []);

  /**
   * Envía la solicitud de adopción (UC05)
   * -------------------------------------------------------------------------
   *  • Requisitos previos
   *      - Usuario autenticado (token en localStorage).
   *      - Teléfono y dirección completos en el perfil.
   *      - Check de confirmación de datos marcado.
   *  • Comportamiento
   *      - Construye el payload mezclando datos del perfil y del formulario.
   *      - Llama al servicio de solicitudes de adopción.
   *      - Muestra toast de resultado y redirige a "Mis solicitudes".
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    // Requiere sesión
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Necesitas iniciar sesión", description: "Inicia sesión para enviar una solicitud de adopción." });
      const from = window.location.pathname + window.location.search + window.location.hash;
      try {
        localStorage.setItem("postLoginRedirect", from);
      } catch (_e) {}
      navigate("/login", { state: { from } });
      return;
    }

    // Requiere confirmación de datos correctos
    const termsChecked = e.currentTarget?.querySelector('#terms')?.checked;
    if (!termsChecked) {
      toast({
        title: "Confirma tus datos",
        description: "Debes confirmar que tus datos son correctos y que cumples con los requisitos de adopción para continuar.",
      });
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
        const from = window.location.pathname + window.location.search + window.location.hash;
        try {
          localStorage.setItem("postProfileRedirect", from);
        } catch (_e) {}
        navigate("/perfil");
        return;
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "No pudimos validar tu perfil. Inicia sesión nuevamente.";
      toast({ title: "Error de perfil", description: msg });
      if (err?.response?.status === 401) {
        const from = window.location.pathname + window.location.search + window.location.hash;
        try {
          localStorage.setItem("postLoginRedirect", from);
        } catch (_e) {}
        navigate("/login", { state: { from } });
      }
      return;
    }

    // Validar que las preguntas abiertas estén respondidas
    const formData = new FormData(e.currentTarget);
    const experiencia = formData.get('experience')?.toString().trim();
    const motivacion = formData.get('reason')?.toString().trim();
    if (!experiencia || !motivacion) {
      toast({
        title: "Faltan respuestas",
        description: "Por favor contanos tu experiencia con mascotas y por qué querés adoptar antes de enviar la solicitud.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Capturar todos los datos del formulario
      const payload = {
        idAnimal: animalId,
        nombre: formData.get('firstName')?.toString().trim() || me?.nombre || '',
        apellido: formData.get('lastName')?.toString().trim() || me?.apellido || '',
        email: formData.get('email')?.toString().trim() || me?.email || '',
        telefono: me?.telefono?.toString().trim() || '',
        direccion: me?.direccion?.toString().trim() || '',
        experienciaPrevia: experiencia,
        motivacion: motivacion,
      };
      
      await adoptionApplicationsService.create(payload);

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

  // Si no hay sesión iniciada, mostrar aviso y botones en lugar del formulario
  if (!isAuthenticated) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Para completar una solicitud de adopción necesitás iniciar sesión o crear una cuenta.
          Usaremos los datos de tu perfil (teléfono y dirección) como datos de contacto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              const from = window.location.pathname + window.location.search + window.location.hash;
              try {
                localStorage.setItem("postLoginRedirect", from);
              } catch (_e) {}
              navigate("/login", { state: { from } });
            }}
          >
            Iniciar sesión
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const from = window.location.pathname + window.location.search + window.location.hash;
              try {
                localStorage.setItem("postLoginRedirect", from);
              } catch (_e) {}
              navigate("/register", { state: { from } });
            }}
          >
            Crear cuenta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Aviso si faltan datos de contacto en el perfil */}
      {(!me?.telefono || !me?.direccion) && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
          <p className="font-semibold text-[0.8rem] uppercase tracking-wide">Completa tus datos de contacto</p>
          <p>
            Antes de enviar la solicitud, necesitamos que completes tu <span className="font-semibold">teléfono</span> y
            <span className="font-semibold"> dirección</span> en tu perfil.
          </p>
          <div className="pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-amber-400 text-amber-900 hover:bg-amber-100"
              onClick={() => {
                const from = window.location.pathname + window.location.search + window.location.hash;
                try {
                  localStorage.setItem("postProfileRedirect", from);
                } catch (_e) {}
                navigate("/perfil");
              }}
            >
              Completar mi perfil
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md bg-white/70 border p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-[0.8rem] uppercase tracking-wide text-primary">
          Requisitos para adoptar
        </p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Ser mayor de edad y presentar identificación válida.</li>
          <li>Tener un domicilio estable y adecuado para el animal.</li>
          <li>Contar con recursos económicos suficientes para mantener al animal.</li>
          <li>Disponer de tiempo para atender las necesidades del animal.</li>
          <li>Aceptar las condiciones del contrato de adopción.</li>
          <li>Compromiso de cuidado responsable y de no abandono.</li>
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input 
            id="firstName" 
            name="firstName"
            defaultValue={me?.nombre || ''}
            required
            disabled={disabled || isSubmitting} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input 
            id="lastName" 
            name="lastName"
            defaultValue={me?.apellido || ''}
            required
            disabled={disabled || isSubmitting} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico *</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          defaultValue={me?.email || ''}
          required
          disabled={disabled || isSubmitting} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (desde tu perfil)</Label>
        <Input id="phone" type="tel" value={me?.telefono || ""} readOnly disabled={disabled || isSubmitting} />
        <div className="text-xs text-muted-foreground">
          Para cambiarlo, edita tu
          {" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              const from = window.location.pathname + window.location.search + window.location.hash;
              try {
                localStorage.setItem("postProfileRedirect", from);
              } catch (_e) {}
              navigate('/perfil');
            }}
          >
            perfil
          </button>.
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección (desde tu perfil)</Label>
        <Input id="address" value={me?.direccion || ""} readOnly disabled={disabled || isSubmitting} />
        <div className="text-xs text-muted-foreground">
          Para cambiarla, edita tu
          {" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              const from = window.location.pathname + window.location.search + window.location.hash;
              try {
                localStorage.setItem("postProfileRedirect", from);
              } catch (_e) {}
              navigate('/perfil');
            }}
          >
            perfil
          </button>.
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">¿Has tenido mascotas antes? Cuéntanos tu experiencia *</Label>
        <Textarea 
          id="experience" 
          name="experience"
          placeholder="Ej: He tenido perros toda mi vida, actualmente tengo un gato..."
          disabled={disabled || isSubmitting} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">¿Por qué quieres adoptar a {animalName}? *</Label>
        <Textarea 
          id="reason" 
          name="reason"
          placeholder={`Ej: Me encanta la personalidad de ${animalName}, tengo un hogar preparado...`}
          disabled={disabled || isSubmitting} 
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" disabled={disabled || isSubmitting} />
          <div className="space-y-1 leading-none">
            <Label htmlFor="terms" className="text-sm font-medium">
              Confirmo que mis datos son correctos y que cumplo con los requisitos de adopción.
            </Label>
            <p className="text-xs text-muted-foreground">
              La confirmación final se realizará por el equipo de Salvando Huellas.
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={disabled || isSubmitting || !me?.telefono || !me?.direccion}
      >
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
