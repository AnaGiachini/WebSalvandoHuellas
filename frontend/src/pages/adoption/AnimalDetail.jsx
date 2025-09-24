import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import AdoptionForm from "../../components/AdoptionForm";
import animalsService from "../../services/animalsService";
import { useToast } from "../../hooks/useToast";

// Etiquetas amigables de estado de adopción
const mapEstado = (estado) => {
  switch (estado) {
    case "sin_hogar":
      return "Disponible";
    case "en_proceso":
      return "En proceso";
    case "adoptado":
      return "Adoptado";
    default:
      return estado || "";
  }
};

/* -------------------- Tabs mínimos (sin dependencias) -------------------- */
function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, { __tabs: { value, setValue } }) : child
  );
}
function TabsList({ className = "", __tabs, children }) {
  return (
    <div className={`inline-grid gap-2 ${className}`} role="tablist">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { __tabs }) : child
      )}
    </div>
  );
}
function TabsTrigger({ value, children, __tabs }) {
  const active = __tabs.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => __tabs.setValue(value)}
      className={`px-3 py-2 text-sm rounded-md border ${
        active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent border-border"
      }`}
    >
      {children}
    </button>
  );
}
function TabsContent({ value, __tabs, className = "", children }) {
  if (__tabs.value !== value) return null;
  return <div className={className}>{children}</div>;
}
/* ------------------------------------------------------------------------ */

export default function AnimalDetalle() {
  const { id } = useParams();
  const { toast } = useToast();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formAnchorId = "adoption-form-anchor";

  const refetch = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await animalsService.getById(id);
      setAnimal(data);
    } catch (err) {
      setError("No pudimos cargar el animal");
      toast({ title: "Error", description: err?.response?.data?.message || "Error al obtener el animal" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, [id]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-muted-foreground">Cargando información del animal...</div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="container py-12">
        <Link to="/adopcion" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista de animales
        </Link>
        <p className="text-muted-foreground">No encontramos información para este animal.</p>
      </div>
    );
  }

  // Defaults seguros para propiedades opcionales
  const fotos = Array.isArray(animal.fotos) ? animal.fotos : [];
  const personalidad = Array.isArray(animal.personalidad) ? animal.personalidad : [];
  const requisitos = Array.isArray(animal.requisitos) ? animal.requisitos : [];

  const estadoAmigable = mapEstado(animal.estadoAdopcion);
  const noDisponible = animal.estadoAdopcion !== 'sin_hogar';

  return (
    <div className="container py-8 md:py-12">
      <Link to="/adopcion" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista de animales
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Columna izquierda: Imagen y detalles */}
        <div>
          {/* Imagen principal */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={animal.foto || "/placeholder.svg"}
              alt={animal.nombre}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Galería (mostrar solo si hay fotos adicionales) */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {fotos.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${animal.nombre} - Imagen ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="about">Sobre {animal.nombre}</TabsTrigger>
              <TabsTrigger value="personality">Personalidad</TabsTrigger>
              <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Información</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Sexo</Badge>
                  <span>{animal.sexo}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Edad</Badge>
                  <span>{animal.edad}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Tamaño</Badge>
                  <span>{animal.tamano}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Estado</Badge>
                  <span>{estadoAmigable}</span>
                </div>
              </div>
              {animal.historia && (
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Historia</h4>
                  <p className="text-muted-foreground">{animal.historia}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="personality" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Personalidad y comportamiento</h3>
              {personalidad.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {personalidad.map((trait, index) => (
                    <Badge key={index} className="bg-primary/20 text-primary hover:bg-primary/30">
                      {trait}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin información específica.</p>
              )}
              <p className="text-muted-foreground">
                Cada animal tiene su propia personalidad única. Estas características pueden ayudarte a determinar si {" "}
                {animal.nombre} es compatible con tu estilo de vida y hogar.
              </p>
            </TabsContent>

            <TabsContent value="requirements" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Requisitos para adoptar a {animal.nombre}</h3>
              {requisitos.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {requisitos.map((r, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Sin requisitos adicionales.</p>
              )}
              <p className="text-muted-foreground">
                Estos requisitos son importantes para asegurar que {animal.nombre} encuentre un hogar adecuado.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna derecha: Info y formulario */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary">{animal.nombre}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{animal.sexo}</Badge>
                    <Badge variant="outline">{animal.edad}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigator.share?.({ title: animal.nombre })}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Edad</p>
                  <p className="font-medium">{animal.edad}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="font-medium">{animal.sexo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tamaño</p>
                  <p className="font-medium">{animal.tamano}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={noDisponible}
                  title={noDisponible ? `Este animal está ${estadoAmigable.toLowerCase()}` : "Enviar solicitud de adopción"}
                  onClick={() => {
                    const el = document.getElementById(formAnchorId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {noDisponible ? 'No disponible' : 'Solicitar adopción'}
                </Button>
                {noDisponible && (
                  <p className="text-xs text-muted-foreground">
                    Este animal no está disponible actualmente ({estadoAmigable}). Puedes explorar otras opciones en la página de
                    <Link to="/adopcion" className="text-primary underline"> adopción</Link>.
                  </p>
                )}
                <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar visita
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulario */}
          <div className="bg-primary/5 rounded-lg p-6" id={formAnchorId}>
            <h2 className="text-xl font-bold text-primary mb-4">Solicitud de Adopción</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Completa el siguiente formulario para iniciar el proceso de adopción de {animal.nombre}.
            </p>
            <AdoptionForm
              animalId={animal.idAnimal}
              animalName={animal.nombre}
              disabled={noDisponible}
              onSubmitted={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
