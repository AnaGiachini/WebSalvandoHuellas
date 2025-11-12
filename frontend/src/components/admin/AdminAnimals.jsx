/** 
 * Componente AdminAnimals
 * -------------------------
 * Muestra una lista de animales
 * con opciones para crear, editar y eliminar.
 */
import { useEffect, useState, useCallback } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import animalsService from "../../services/animalsService";
import { useToast } from "../../hooks/useToast";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function AdminAnimals() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal/form state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // objeto animal o null
  const [form, setForm] = useState({
    nombre: "",
    especie: "perro",
    sexo: "macho",
    edad: "joven",
    tamano: "mediano",
    historia: "",
    estadoAdopcion: "sin_hogar",
    foto: "",
  });
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });

  const loadAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await animalsService.list();
      setAnimals(Array.isArray(data) ? data : data?.data || []);
      setError(null);
    } catch (err) {
      setError("No pudimos cargar los animales");
      toast({ title: "Error", description: err?.response?.data?.message || "Error al obtener animales" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  const filteredAnimals = animals.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.nombre?.toLowerCase().includes(term) ||
      a.sexo?.toLowerCase().includes(term) ||
      a.edad?.toLowerCase().includes(term) ||
      a.tamano?.toLowerCase().includes(term) ||
      a.estadoAdopcion?.toLowerCase().includes(term)
    );
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: "", especie: "perro", sexo: "macho", edad: "joven", tamano: "mediano", historia: "", estadoAdopcion: "sin_hogar", foto: "" });
    setOpen(true);
  };

  const openEdit = (animal) => {
    setEditing(animal);
    setForm({
      nombre: animal.nombre || "",
      especie: animal.especie || "perro",
      sexo: animal.sexo || "macho",
      edad: animal.edad || "joven",
      tamano: animal.tamano || "mediano",
      historia: animal.historia || "",
      estadoAdopcion: animal.estadoAdopcion || "sin_hogar",
      foto: animal.foto || "",
    });
    setOpen(true);
  };

  const onDelete = (idAnimal) => {
    setConfirm({
      open: true,
      title: "Eliminar animal",
      description: "¿Eliminar este animal?",
      onConfirm: async () => {
        try {
          await animalsService.remove(idAnimal);
          toast({ title: "Eliminado", description: "Animal eliminado correctamente" });
          loadAnimals();
        } catch (err) {
          toast({ title: "Error al eliminar", description: err?.response?.data?.message || "No se pudo eliminar" });
        }
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await animalsService.update(editing.idAnimal, form);
        toast({ title: "Actualizado", description: "Animal actualizado correctamente" });
      } else {
        await animalsService.create(form);
        toast({ title: "Creado", description: "Animal creado correctamente" });
      }
      setOpen(false);
      loadAnimals();
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      let description = err?.response?.data?.message || "No se pudo guardar el animal";
      if (Array.isArray(backendErrors) && backendErrors.length) {
        description = backendErrors.map((e) => (e?.msg ? `${e.path}: ${e.msg}` : null)).filter(Boolean).join(" | ");
      }
      toast({ title: "Error", description });
    }
  };

  const statusBadge = (estado) => {
    const map = {
      sin_hogar: "bg-yellow-500",
      en_proceso: "bg-blue-500",
      adoptado: "bg-green-600",
    };
    return <Badge className={map[estado] || "bg-gray-500"}>{estado}</Badge>;
  };

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
          <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo animal
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Cargando...</TableCell></TableRow>
            ) : filteredAnimals.length > 0 ? (
              filteredAnimals.map((animal) => (
                <TableRow key={animal.idAnimal}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={animal.foto || "/placeholder.svg"}
                          alt={animal.nombre}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-medium">{animal.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{animal.especie}</Badge></TableCell>
                  <TableCell>{animal.sexo}</TableCell>
                  <TableCell>{animal.edad}</TableCell>
                  <TableCell>{animal.tamano}</TableCell>
                  <TableCell>{statusBadge(animal.estadoAdopcion)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/adopcion/${animal.idAnimal}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(animal)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(animal.idAnimal)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar animal" : "Nuevo animal"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="especie">Especie</Label>
                <select id="especie" className="w-full h-10 rounded-md border px-3 text-sm" value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} required>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="sexo">Sexo</Label>
                <select id="sexo" className="w-full h-10 rounded-md border px-3 text-sm" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edad">Edad</Label>
                <select id="edad" className="w-full h-10 rounded-md border px-3 text-sm" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })}>
                  <option value="cachorro">cachorro</option>
                  <option value="joven">joven</option>
                  <option value="adulto">adulto</option>
                  <option value="adulto mayor">adulto mayor</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tamano">Tamaño</Label>
                <select id="tamano" className="w-full h-10 rounded-md border px-3 text-sm" value={form.tamano} onChange={(e) => setForm({ ...form, tamano: e.target.value })}>
                  <option value="pequeño">pequeño</option>
                  <option value="mediano">mediano</option>
                  <option value="grande">grande</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="historia">Historia</Label>
              <Input id="historia" value={form.historia} onChange={(e) => setForm({ ...form, historia: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="foto">Foto (URL)</Label>
              <Input id="foto" value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="estadoAdopcion">Estado de adopción</Label>
              <select id="estadoAdopcion" className="w-full h-10 rounded-md border px-3 text-sm" value={form.estadoAdopcion} onChange={(e) => setForm({ ...form, estadoAdopcion: e.target.value })}>
                <option value="sin_hogar">sin_hogar</option>
                <option value="en_proceso">en_proceso</option>
                <option value="adoptado">adoptado</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">{editing ? "Guardar cambios" : "Crear"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(v) => setConfirm((c) => ({ ...c, open: v }))}
        title={confirm.title}
        description={confirm.description}
        onConfirm={confirm.onConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
}
