import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import animalsService from "../services/animalsService";

export default function FeaturedAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Traemos animales disponibles para adopción (estadoAdopcion = 'sin_hogar')
        const data = await animalsService.getByStatus("sin_hogar");
        const list = Array.isArray(data) ? data : data?.data || [];
        // Mostramos solo algunos destacados en Home
        setAnimals(list.slice(0, 4));
        setError("");
      } catch (e) {
        console.error("Error cargando animales destacados", e);
        setError("No pudimos cargar los animales en adopción.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Cargando animales en adopción...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-8 text-center text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!animals.length) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Por el momento no hay animales disponibles para adopción.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {animals.map((animal) => (
        <Card key={animal.idAnimal} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={animal.foto || "/placeholder.svg"}
              alt={animal.nombre}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <Badge className="absolute top-2 right-2 bg-primary">
              {animal.especie || "Animal"}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-bold">{animal.nombre}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {animal.tamano && <Badge variant="outline">{animal.tamano}</Badge>}
              {animal.edad && <Badge variant="outline">{animal.edad}</Badge>}
              {animal.sexo && <Badge variant="outline">{animal.sexo}</Badge>}
            </div>
            {animal.historia && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {animal.historia}
              </p>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link to={`/adopcion/${animal.idAnimal}`} className="w-full">
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
