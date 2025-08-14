import React from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

// Datos de ejemplo para animales en adopción
const animals = [
  {
    id: 1,
    name: "Luna",
    type: "Perro",
    breed: "Mestizo",
    age: "2 años",
    gender: "Hembra",
    size: "Mediano",
    image: "/images/dog1.jpg",
    description:
      "Luna es una perrita muy cariñosa y juguetona. Le encanta correr y jugar con pelotas.",
  },
  {
    id: 2,
    name: "Simba",
    type: "Gato",
    breed: "Atigrado",
    age: "1 año",
    gender: "Macho",
    size: "Pequeño",
    image: "/images/cat1.jpg",
    description:
      "Simba es un gato muy tranquilo y cariñoso. Le encanta dormir en lugares cálidos.",
  },
  {
    id: 3,
    name: "Rocky",
    type: "Perro",
    breed: "Labrador",
    age: "3 años",
    gender: "Macho",
    size: "Grande",
    image: "/images/dog2.jpg",
    description:
      "Rocky es un perro muy activo y leal. Ideal para familias con niños.",
  },
  {
    id: 4,
    name: "Mía",
    type: "Gato",
    breed: "Siamés",
    age: "2 años",
    gender: "Hembra",
    size: "Pequeño",
    image: "/images/cat2.jpg",
    description:
      "Mía es una gata muy independiente pero cariñosa. Le gusta la tranquilidad.",
  },
  {
    id: 5,
    name: "Max",
    type: "Perro",
    breed: "Golden Retriever",
    age: "4 años",
    gender: "Macho",
    size: "Grande",
    image: "/images/dog3.jpg",
    description:
      "Max es un perro muy amigable y juguetón. Le encanta nadar y jugar al aire libre.",
  },
  {
    id: 6,
    name: "Nala",
    type: "Gato",
    breed: "Mestizo",
    age: "3 años",
    gender: "Hembra",
    size: "Mediano",
    image: "/images/cat3.jpg",
    description:
      "Nala es una gata muy cariñosa y juguetona. Le encanta trepar y explorar.",
  },
  {
    id: 7,
    name: "Toby",
    type: "Perro",
    breed: "Beagle",
    age: "2 años",
    gender: "Macho",
    size: "Mediano",
    image: "/images/dog4.jpg",
    description:
      "Toby es un perro muy curioso y activo. Le encanta olfatear y explorar nuevos lugares.",
  },
  {
    id: 8,
    name: "Lola",
    type: "Gato",
    breed: "Persa",
    age: "5 años",
    gender: "Hembra",
    size: "Pequeño",
    image: "/images/cat4.jpg",
    description:
      "Lola es una gata muy tranquila y elegante. Le gusta la paz y la tranquilidad.",
  },
];

export default function AdopcionIndex() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Animales en Adopción
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Todos nuestros animales han sido rescatados, rehabilitados y están
          listos para encontrar un hogar permanente. Adoptar es un acto de amor
          que cambia vidas.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-primary/5 rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">Filtrar animales</h2>
        </div>

        {/* Usamos inputs nativos para evitar dependencias extra */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="text-sm font-medium">
              Buscar por nombre
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="search"
                placeholder="Buscar..."
                className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="text-sm font-medium">
              Tipo
            </label>
            <select
              id="type"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue="all"
            >
              <option value="all">Todos</option>
              <option value="dog">Perros</option>
              <option value="cat">Gatos</option>
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="text-sm font-medium">
              Género
            </label>
            <select
              id="gender"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue="all"
            >
              <option value="all">Todos</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="text-sm font-medium">
              Tamaño
            </label>
            <select
              id="size"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue="all"
            >
              <option value="all">Todos</option>
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de animales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animals.map((animal) => (
          <Card key={animal.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={animal.image || "/placeholder.svg"}
                alt={animal.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <Badge className="absolute top-2 right-2 bg-primary">
                {animal.type}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{animal.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{animal.breed}</Badge>
                <Badge variant="outline">{animal.age}</Badge>
                <Badge variant="outline">{animal.gender}</Badge>
                <Badge variant="outline">{animal.size}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {animal.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link to={`/adopcion/${animal.id}`} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Ver detalles
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Información sobre adopción */}
      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Proceso de Adopción
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-medium mb-2">Selecciona un animal</h3>
            <p className="text-sm text-muted-foreground">
              Explora nuestros animales disponibles y encuentra el que mejor se
              adapte a ti.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-medium mb-2">Completa la solicitud</h3>
            <p className="text-sm text-muted-foreground">
              Llena el formulario de adopción con tus datos y preferencias.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-medium mb-2">Entrevista y visita</h3>
            <p className="text-sm text-muted-foreground">
              Realizaremos una entrevista y posiblemente una visita a tu hogar
              para asegurar un buen ambiente.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Para más información sobre nuestro proceso de adopción, requisitos y
            responsabilidades, por favor contacta con nosotros.
          </p>
          <Link to="/informacion/adopcion">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Más información sobre adopción
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
