import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdownMenu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// Datos de ejemplo para animales
const animals = [
  {
    id: 1,
    name: "Luna",
    type: "Perro",
    breed: "Mestizo",
    age: "2 años",
    gender: "Hembra",
    status: "Disponible",
    image: "/images/dog1.jpg",
  },
  {
    id: 2,
    name: "Simba",
    type: "Gato",
    breed: "Atigrado",
    age: "1 año",
    gender: "Macho",
    status: "Disponible",
    image: "/images/cat1.jpg",
  },
  {
    id: 3,
    name: "Rocky",
    type: "Perro",
    breed: "Labrador",
    age: "3 años",
    gender: "Macho",
    status: "En proceso",
    image: "/images/dog2.jpg",
  },
  {
    id: 4,
    name: "Mía",
    type: "Gato",
    breed: "Siamés",
    age: "2 años",
    gender: "Hembra",
    status: "Disponible",
    image: "/images/cat2.jpg",
  },
  {
    id: 5,
    name: "Max",
    type: "Perro",
    breed: "Golden Retriever",
    age: "4 años",
    gender: "Macho",
    status: "Adoptado",
    image: "/images/dog3.jpg",
  },
];

export default function AdminAnimals() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar animales según término de búsqueda
  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Animales</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar animal..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo animal
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimals.length > 0 ? (
              filteredAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={animal.image || "/placeholder.svg"}
                          alt={animal.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-medium">{animal.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.age}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        animal.status === "Disponible"
                          ? "bg-green-500"
                          : animal.status === "En proceso"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }
                    >
                      {animal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No se encontraron resultados para "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
