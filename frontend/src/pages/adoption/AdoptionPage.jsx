import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/useToast";
import animalsService from "../../services/animalsService";

// Mapear estados técnicos a etiquetas amigables
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

export default function AdopcionIndex() {
  const { toast } = useToast();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros controlados
  const [especie, setEspecie] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [tamano, setTamano] = useState("");
  // Por defecto: solo animales disponibles (sin_hogar)
  const [estadoAdopcion, setEstadoAdopcion] = useState("sin_hogar");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await animalsService.list();
        setAnimals(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError("No pudimos cargar los animales");
        toast({
          title: "Error",
          description: err?.response?.data?.message || "Error al obtener animales",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const filtered = useMemo(() => {
    return (animals || []).filter((a) => {
      if (!a) return false;
      const byEspecie = especie ? (a.especie || "").toLowerCase() === especie.toLowerCase() : true;
      const bySexo = sexo ? a.sexo === sexo : true;
      const byEdad = edad ? a.edad === edad : true;
      const byTamano = tamano ? a.tamano === tamano : true;

      // Filtro por estado
      let byEstado = true;
      if (estadoAdopcion === "sin_hogar" || estadoAdopcion === "en_proceso" || estadoAdopcion === "adoptado") {
        byEstado = a.estadoAdopcion === estadoAdopcion;
      }
      // Si estadoAdopcion === "" → "Todos": no se filtra por estado

      return byEspecie && bySexo && byEdad && byTamano && byEstado;
    });
  }, [animals, especie, sexo, edad, tamano, estadoAdopcion]);

  const resetFilters = () => {
    setEspecie("");
    setSexo("");
    setEdad("");
    setTamano("");
    // Restaurar filtro por defecto: solo disponibles (sin_hogar)
    setEstadoAdopcion("sin_hogar");
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Animales en Adopción</h1>
        <p className="text-muted-foreground max-w-3xl">
          Todos nuestros animales han sido rescatados, rehabilitados y están listos para encontrar un hogar permanente.
          Adoptar es un acto de amor que cambia vidas.
        </p>
      </div>

      {/* Filtros funcionales */}
      <div className="bg-primary/5 rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">Filtrar animales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="especie" className="text-sm font-medium">
              Especie
            </label>
            <select
              id="especie"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>
          <div>
            <label htmlFor="sexo" className="text-sm font-medium">
              Sexo
            </label>
            <select
              id="sexo"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label htmlFor="edad" className="text-sm font-medium">
              Edad
            </label>
            <select
              id="edad"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="cachorro">Cachorro</option>
              <option value="joven">Joven</option>
              <option value="adulto">Adulto</option>
              <option value="adulto mayor">Adulto mayor</option>
            </select>
          </div>
          <div>
            <label htmlFor="tamano" className="text-sm font-medium">
              Tamaño
            </label>
            <select
              id="tamano"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div>
            <label htmlFor="estado" className="text-sm font-medium">
              Estado
            </label>
            <select
              id="estado"
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={estadoAdopcion}
              onChange={(e) => setEstadoAdopcion(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="sin_hogar">Disponibles</option>
              <option value="en_proceso">En proceso</option>
              <option value="adoptado">Adoptado</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-muted-foreground">Cargando animales...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No hay animales que coincidan con los filtros.
            </div>
          )}
          {filtered.map((animal) => (
            <Card key={animal.idAnimal} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={animal.foto || "/placeholder.svg"}
                  alt={animal.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <Badge className="absolute top-2 right-2 bg-primary">{animal.sexo}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{animal.nombre}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{animal.edad}</Badge>
                  <Badge variant="outline">{animal.tamano}</Badge>
                  <Badge variant="outline">{mapEstado(animal.estadoAdopcion)}</Badge>
                </div>
                {animal.historia && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{animal.historia}</p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/adopcion/${animal.idAnimal}`} className="w-full">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={animal.estadoAdopcion !== "sin_hogar"}
                  >
                    {animal.estadoAdopcion === "sin_hogar" ? "Ver detalles" : "No disponible"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Información sobre adopción */}
      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Proceso de Adopción</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-medium mb-2">Selecciona un animal</h3>
            <p className="text-sm text-muted-foreground">
              Explora nuestros animales en adopción y encontrá a tu próximo compañero.
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
              Realizaremos una entrevista y posiblemente una visita a tu hogar para asegurar un buen ambiente.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Para más información sobre nuestro proceso de adopción, requisitos y responsabilidades, por favor contacta
            con nosotros.
          </p>
          <Link to="/informacion?tab=adoption">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Más información sobre adopción
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}