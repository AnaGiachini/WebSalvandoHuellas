import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import AdoptionForm from "../../components/AdoptionForm";

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

// Datos de ejemplo (puedes reemplazar por fetch según el :id)
const dataById = {
  1: {
    id: 1,
    name: "Luna",
    type: "Perro",
    breed: "Mestizo",
    age: "2 años",
    gender: "Hembra",
    size: "Mediano",
    weight: "15 kg",
    color: "Marrón y blanco",
    vaccinated: true,
    sterilized: true,
    microchip: false,
    specialNeeds: false,
    arrivalDate: "2023-01-15",
    images: ["/images/dog1.jpg", "/images/dog1-2.jpg", "/images/dog1-3.jpg"],
    description:
      "Luna es una perrita muy cariñosa y juguetona. Le encanta correr y jugar con pelotas. Es sociable con otros perros y niños. Fue rescatada de la calle y ahora está lista para encontrar un hogar permanente.",
    personality: ["Juguetona", "Cariñosa", "Sociable", "Activa", "Leal"],
    requirements: [
      "Hogar con espacio suficiente para que pueda jugar",
      "Familia que pueda dedicarle tiempo para paseos y juegos",
      "Preferiblemente sin otros animales pequeños (como hamsters o conejos)",
      "Compromiso de cuidado responsable",
    ],
  },
};

export default function AnimalDetalle() {
  const { id } = useParams();
  const animal = dataById[id];

  if (!animal) {
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

  return (
    <div className="container py-8 md:py-12">
      <Link to="/adopcion" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista de animales
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Columna izquierda: Imágenes y tabs */}
        <div>
          {/* Imagen principal */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={animal.images[0] || "/placeholder.svg"}
              alt={animal.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Galería */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {animal.images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${animal.name} - Imagen ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="about">Sobre {animal.name}</TabsTrigger>
              <TabsTrigger value="personality">Personalidad</TabsTrigger>
              <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Historia y descripción</h3>
              <p className="text-muted-foreground mb-4">{animal.description}</p>

              <h3 className="text-lg font-medium mb-4">Información adicional</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Vacunado</Badge>
                  <span>{animal.vaccinated ? "Sí" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Esterilizado</Badge>
                  <span>{animal.sterilized ? "Sí" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Microchip</Badge>
                  <span>{animal.microchip ? "Sí" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Necesidades especiales</Badge>
                  <span>{animal.specialNeeds ? "Sí" : "No"}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Personalidad y comportamiento</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {animal.personality.map((trait, index) => (
                  <Badge key={index} className="bg-primary/20 text-primary hover:bg-primary/30">
                    {trait}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground">
                Cada animal tiene su propia personalidad única. Estas características pueden ayudarte a determinar si{" "}
                {animal.name} es compatible con tu estilo de vida y hogar.
              </p>
            </TabsContent>

            <TabsContent value="requirements" className="p-4 bg-primary/5 rounded-lg mt-2">
              <h3 className="text-lg font-medium mb-4">Requisitos para adoptar a {animal.name}</h3>
              <ul className="space-y-2 mb-4">
                {animal.requirements.map((r, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                Estos requisitos son importantes para asegurar que {animal.name} encuentre un hogar adecuado.
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
                  <h1 className="text-3xl font-bold text-primary">{animal.name}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{animal.type}</Badge>
                    <Badge variant="outline">{animal.breed}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigator.share?.({ title: animal.name })}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Edad</p>
                  <p className="font-medium">{animal.age}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="font-medium">{animal.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tamaño</p>
                  <p className="font-medium">{animal.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-medium">{animal.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-medium">{animal.color}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Llegada</p>
                  <p className="font-medium">
                    {new Date(animal.arrivalDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  <Heart className="h-4 w-4 mr-2" />
                  Solicitar adopción
                </Button>
                <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar visita
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulario */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Solicitud de Adopción</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Completa el siguiente formulario para iniciar el proceso de adopción de {animal.name}.
            </p>
            <AdoptionForm animalName={animal.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
