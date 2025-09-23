import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/useToast";
import animalsService from "../../services/animalsService";

export default function AdopcionIndex() {
  const { toast } = useToast();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros controlados
  const [search, setSearch] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [tamano, setTamano] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await animalsService.list();
        setAnimals(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError("No pudimos cargar los animales");
        toast({ title: "Error", description: err?.response?.data?.message || "Error al obtener animales" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (animals || []).filter((a) => {
      if (!a) return false;
      const byName = term ? (a.nombre || "").toLowerCase().includes(term) : true;
      const bySexo = sexo ? a.sexo === sexo : true;
      const byEdad = edad ? a.edad === edad : true;
      const byTamano = tamano ? a.tamano === tamano : true;
      return byName && bySexo && byEdad && byTamano;
    });
  }, [animals, search, sexo, edad, tamano]);

  const resetFilters = () => {
    setSearch("");
    setSexo("");
    setEdad("");
    setTamano("");
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Animales en Adopción</h1>
        <p className="text-muted-foreground max-w-3xl">
          Todos nuestros animales han sido rescatados, rehabilitados y están listos para encontrar un hogar permanente. Adoptar es un acto de amor que cambia vidas.
        </p>
      </div>

      {/* Filtros funcionales */}
      <div className="bg-primary/5 rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">Filtrar animales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="text-sm font-medium">Buscar por nombre</label>
            <div className="relative mt-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="search"
                placeholder="Buscar..."
                className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="sexo" className="text-sm font-medium">Sexo</label>
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
            <label htmlFor="edad" className="text-sm font-medium">Edad</label>
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
            <label htmlFor="tamano" className="text-sm font-medium">Tamaño</label>
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
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={resetFilters}>Limpiar filtros</Button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-muted-foreground">Cargando animales...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No hay animales que coincidan con los filtros.</div>
          )}
          {filtered.map((animal) => (
            <Card key={animal.idAnimal} className="overflow-hidden">
              <div className="relative aspect-square">
                <img src={animal.foto || "/placeholder.svg"} alt={animal.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <Badge className="absolute top-2 right-2 bg-primary">{animal.sexo}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{animal.nombre}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{animal.edad}</Badge>
                  <Badge variant="outline">{animal.tamano}</Badge>
                  <Badge variant="outline">{animal.estadoAdopcion}</Badge>
                </div>
                {animal.historia && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{animal.historia}</p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/adopcion/${animal.idAnimal}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90" disabled={animal.estadoAdopcion !== 'sin_hogar'}>
                    {animal.estadoAdopcion === 'sin_hogar' ? 'Ver detalles' : 'No disponible'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Información sobre adopción (igual que antes) */}
      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Proceso de Adopción</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">1</div>
            <h3 className="text-lg font-medium mb-2">Selecciona un animal</h3>
            <p className="text-sm text-muted-foreground">Explora nuestros animales disponibles y encuentra el que mejor se adapte a ti.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">2</div>
            <h3 className="text-lg font-medium mb-2">Completa la solicitud</h3>
            <p className="text-sm text-muted-foreground">Llena el formulario de adopción con tus datos y preferencias.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mb-4">3</div>
            <h3 className="text-lg font-medium mb-2">Entrevista y visita</h3>
            <p className="text-sm text-muted-foreground">Realizaremos una entrevista y posiblemente una visita a tu hogar para asegurar un buen ambiente.</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Para más información sobre nuestro proceso de adopción, requisitos y responsabilidades, por favor contacta con nosotros.</p>
          <Link to="/informacion/adopcion">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Más información sobre adopción</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
