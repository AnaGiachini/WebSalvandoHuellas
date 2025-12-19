/**
 * Componente AdminEvents
 * -------------------------
 * Panel de administración para la gestión de eventos.
 *
 *  • Casos de uso
 *      - UC04: Crear evento (alta de nuevos eventos desde el modal "Nuevo evento")
 *      - Actualizar y eliminar eventos existentes para mantener la agenda al día.
 */
import { useEffect, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import Loading from "../ui/Loading";
import { createEvent, getEvents, updateEvent as updateEventApi, deleteEvent as deleteEventApi } from "../../services/eventsService";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useToast } from "../../hooks/useToast";

export default function AdminEvents() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: "", descripcion: "", fecha: "", lugar: "", foto: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });
  const [editDialog, setEditDialog] = useState({ open: false, mode: null, value: "", event: null });

  // Cargar eventos desde backend
  useEffect(() => {
    const load = async () => {
      try {
        const list = await getEvents();
        const mapped = (list || []).map((e) => ({
          id: e.idEvento,
          title: e.titulo,
          date: e.fecha,
          time: "",
          location: e.lugar,
          status: new Date(e.fecha) >= new Date() ? "Próximo" : "Finalizado",
          image: e.foto,
          description: e.descripcion,
        }));
        setEvents(mapped);
      } catch (e) {
        setError("No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtrar eventos según término de búsqueda
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear fecha (JS)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const openEditDialog = (event, mode) => {
    if (mode === "title") {
      setEditDialog({ open: true, mode: "title", value: event.title, event });
    } else if (mode === "date") {
      const current = event.date ? new Date(event.date) : new Date();
      const value = current.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      setEditDialog({ open: true, mode: "date", value, event });
    }
  };

  const handleEditSave = async () => {
    const { mode, value, event } = editDialog;
    if (!event || !mode) return;

    try {
      if (mode === "title") {
        const nuevoTitulo = value?.trim();
        if (!nuevoTitulo || nuevoTitulo === event.title) {
          setEditDialog({ open: false, mode: null, value: "", event: null });
          return;
        }
        const payload = { titulo: nuevoTitulo };
        const updated = await updateEventApi(event.id, payload);
        setEvents((prev) => prev.map((e) => e.id === event.id ? {
          ...e,
          title: updated.titulo,
          date: updated.fecha,
          location: updated.lugar,
          image: updated.foto,
          description: updated.descripcion,
        } : e));
        toast({
          title: "Evento actualizado",
          description: `El título se cambió a "${updated.titulo}".`,
        });
      } else if (mode === "date") {
        if (!value) {
          setEditDialog({ open: false, mode: null, value: "", event: null });
          return;
        }
        const iso = new Date(value).toISOString();
        const updated = await updateEventApi(event.id, { fecha: iso });
        setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, date: updated.fecha } : e));
        toast({
          title: "Evento reprogramado",
          description: "La fecha se actualizó correctamente.",
        });
      }
      setEditDialog({ open: false, mode: null, value: "", event: null });
    } catch (e) {
      const errorMsg = e?.response?.data?.message || (mode === "title" ? "No se pudo actualizar el evento" : "No se pudo reprogramar el evento");
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      setError(errorMsg);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      {!!error && (
        <p className="mb-2 text-sm text-red-500" role="alert">{error}</p>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Eventos</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar evento..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear evento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
                <Input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                <Input type="datetime-local" placeholder="Fecha" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
                <Input placeholder="Lugar" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
                <Input placeholder="URL de foto" value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button disabled={submitting} onClick={async () => {
                    // Validaciones frontend
                    if (!form.titulo?.trim()) {
                      toast({
                        title: "Campo requerido",
                        description: "El título es obligatorio.",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (form.titulo.trim().length < 2) {
                      toast({
                        title: "Título muy corto",
                        description: "El título debe tener al menos 2 caracteres.",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (!form.fecha) {
                      toast({
                        title: "Campo requerido",
                        description: "La fecha es obligatoria.",
                        variant: "destructive"
                      });
                      return;
                    }

                    setSubmitting(true);
                    setError("");
                    try {
                      const payload = { ...form };
                      // Asegurar ISO si viene de input datetime-local
                      if (payload.fecha && !payload.fecha.endsWith('Z')) {
                        payload.fecha = new Date(payload.fecha).toISOString();
                      }
                      const created = await createEvent(payload);
                      setEvents((prev) => [
                        ...prev,
                        {
                          id: created.idEvento,
                          title: created.titulo,
                          date: created.fecha,
                          time: "",
                          location: created.lugar,
                          status: new Date(created.fecha) >= new Date() ? "Próximo" : "Finalizado",
                          image: created.foto,
                          description: created.descripcion,
                        },
                      ]);
                      toast({
                        title: "Evento creado",
                        description: `El evento "${created.titulo}" se publicó correctamente.`,
                      });
                      setOpen(false);
                      setForm({ titulo: "", descripcion: "", fecha: "", lugar: "", foto: "" });
                    } catch (e) {
                      const errorMsg = e?.response?.data?.message || "No se pudo crear el evento";
                      toast({
                        title: "Error",
                        description: errorMsg,
                        variant: "destructive"
                      });
                      setError(errorMsg);
                    } finally {
                      setSubmitting(false);
                    }
                  }}>Crear</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-medium">{event.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge className={event.status === "Próximo" ? "bg-green-500" : "bg-gray-500"}>
                      {event.status}
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
                        <DropdownMenuItem onClick={() => openEditDialog(event, "title")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(event, "date")}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Reprogramar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setConfirm({
                            open: true,
                            title: "Eliminar evento",
                            description: `¿Eliminar "${event.title}"?`,
                            onConfirm: async () => {
                              try {
                                await deleteEventApi(event.id);
                                setEvents((prev) => prev.filter((e) => e.id !== event.id));
                                toast({
                                  title: "Evento eliminado",
                                  description: `El evento "${event.title}" se eliminó correctamente.`,
                                });
                              } catch (e) {
                                const errorMsg = e?.response?.data?.message || 'No se pudo eliminar el evento';
                                toast({
                                  title: "Error",
                                  description: errorMsg,
                                  variant: "destructive"
                                });
                                setError(errorMsg);
                              }
                            }
                          });
                        }}>
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
                <TableCell colSpan={6} className="text-center py-4">
                  No se encontraron resultados para "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(v) => setConfirm((c) => ({ ...c, open: v }))}
        title={confirm.title}
        description={confirm.description}
        onConfirm={confirm.onConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
      <Dialog open={editDialog.open} onOpenChange={(open) => {
        if (!open) {
          setEditDialog({ open: false, mode: null, value: "", event: null });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.mode === "title" ? "Editar título" : "Reprogramar fecha"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-2">
            {editDialog.mode === "title" && (
              <Input
                placeholder="Nuevo título"
                value={editDialog.value}
                onChange={(e) => setEditDialog((prev) => ({ ...prev, value: e.target.value }))}
              />
            )}
            {editDialog.mode === "date" && (
              <Input
                type="datetime-local"
                placeholder="Nueva fecha"
                value={editDialog.value}
                onChange={(e) => setEditDialog((prev) => ({ ...prev, value: e.target.value }))}
              />
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialog({ open: false, mode: null, value: "", event: null })}
              >
                Cancelar
              </Button>
              <Button onClick={handleEditSave}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
