import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Datos de ejemplo para animales en adopción
const featuredAnimals = [
  {
    id: 1,
    name: "Luna",
    type: "Perro",
    breed: "Mestizo",
    age: "2 años",
    gender: "Hembra",
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
    image: "/images/cat2.jpg",
    description:
      "Mía es una gata muy independiente pero cariñosa. Le gusta la tranquilidad.",
  },
];

export default function FeaturedAnimals() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {featuredAnimals.map((animal) => (
        <Card key={animal.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={animal.image || "/placeholder.svg"}
              alt={animal.name}
              className="absolute inset-0 h-full w-full object-cover"
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
  );
}
