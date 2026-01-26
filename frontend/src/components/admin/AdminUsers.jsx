/**
 * AdminUsers
 * --------------------------------------------------------------------------
 * Vista de panel de administración para UC07: Gestión de usuarios.
 * Permite a los administradores listar usuarios, crear nuevas cuentas, editar
 * datos de perfil, cambiar el rol (user/admin) y eliminar usuarios, apoyándose
 * en el servicio de usuarios del frontend y las rutas protegidas del backend.
 */
import { useEffect, useMemo, useState } from "react";
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
import { Search, Plus, MoreHorizontal, Shield, Trash2, Edit } from "lucide-react";
import Loading from "../ui/Loading";
import userService from "../../services/userService";
import { useToast } from "../../hooks/useToast";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", contrasena: "", direccion: "", telefono: "", rol: "user" });
  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ idUsuario: null, nombre: "", apellido: "", email: "", direccion: "", telefono: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Confirm dialog state
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await userService.listAll();
        setUsers(list);
      } catch (e) {
        setError("No se pudieron cargar los usuarios");
        toast({ title: "Error", description: e?.response?.data?.message || "No se pudieron cargar los usuarios" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.nombre, u.apellido, u.email, u.rol].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [search, users]);

  // Reset página si cambia el filtro o el tamaño
  useEffect(() => { setPage(1); }, [search, pageSize]);

  const { total, totalPages, paged } = useMemo(() => {
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return { total, totalPages, paged: filtered.slice(start, end) };
  }, [filtered, page, pageSize]);

  const formatName = (u) => `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim();

  return (
    <div>
      {loading && <Loading />}
      {!!error && (
        <p className="mb-2 text-sm text-red-500" role="alert">{error}</p>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                  <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
                </div>
                <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input type="password" placeholder="Contraseña" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
                <Input placeholder="Dirección (opcional)" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                <Input placeholder="Teléfono (opcional)" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select className="px-3 py-2 border rounded-md" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button disabled={submitting} onClick={async () => {
                      setSubmitting(true);
                      setError("");
                      try {
                        const created = await userService.adminCreate(form);
                        setUsers((prev) => [...prev, created]);
                        setOpen(false);
                        setForm({ nombre: "", apellido: "", email: "", contrasena: "", direccion: "", telefono: "", rol: "user" });
                        toast({ title: "Usuario creado", description: `${created?.nombre ?? ""} ${created?.apellido ?? ""}`.trim() || created?.email });
                      } catch (e) {
                        setError("No se pudo crear el usuario");
                        const backendErrors = e?.response?.data?.errors;
                        let description = e?.response?.data?.message || "No se pudo crear el usuario";
                        if (Array.isArray(backendErrors) && backendErrors.length) {
                          description = backendErrors.map((x) => (x?.msg ? `${x.path}: ${x.msg}` : null)).filter(Boolean).join(" | ");
                        }
                        toast({ title: "Error", description });
                      } finally {
                        setSubmitting(false);
                      }
                    }}>Crear</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Edit user dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Nombre" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
                  <Input placeholder="Apellido" value={editForm.apellido} onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })} />
                </div>
                <Input type="email" placeholder="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <Input placeholder="Dirección" value={editForm.direccion} onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })} />
                <Input placeholder="Teléfono" value={editForm.telefono} onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                  <Button disabled={editSubmitting} onClick={async () => {
                    setEditSubmitting(true);
                    try {
                      const { idUsuario, ...payload } = editForm;
                      const updated = await userService.update(idUsuario, payload);
                      setUsers((prev) => prev.map((x) => x.idUsuario === idUsuario ? { ...x, ...updated } : x));
                      setEditOpen(false);
                      toast({ title: "Usuario actualizado", description: `${updated?.nombre ?? ""} ${updated?.apellido ?? ""}`.trim() || updated?.email });
                    } catch (e) {
                      const backendErrors = e?.response?.data?.errors;
                      let description = e?.response?.data?.message || "No se pudo actualizar el usuario";
                      if (Array.isArray(backendErrors) && backendErrors.length) {
                        description = backendErrors.map((x) => (x?.msg ? `${x.path}: ${x.msg}` : null)).filter(Boolean).join(" | ");
                      }
                      toast({ title: "Error", description });
                    } finally {
                      setEditSubmitting(false);
                    }
                  }}>Guardar</Button>
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
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length ? (
              paged.map((u) => (
                <TableRow key={u.idUsuario}>
                  <TableCell>{formatName(u)}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge className={u.rol === "admin" ? "bg-blue-600" : "bg-gray-600"}>{u.rol}</Badge>
                  </TableCell>
                  <TableCell>{u.telefono || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          const nuevoRol = u.rol === 'admin' ? 'user' : 'admin';
                          setConfirm({
                            open: true,
                            title: "Cambiar rol",
                            description: `Cambiar rol de ${formatName(u)} a "${nuevoRol}"?`,
                            onConfirm: async () => {
                              try {
                                const updated = await userService.changeRole(u.idUsuario, nuevoRol);
                                setUsers((prev) => prev.map((x) => x.idUsuario === u.idUsuario ? { ...x, rol: updated.rol } : x));
                                toast({ title: "Rol actualizado", description: `${formatName(u)} ahora es ${updated.rol}` });
                              } catch (e) {
                                setError('No se pudo cambiar el rol');
                                toast({ title: "Error", description: e?.response?.data?.message || 'No se pudo cambiar el rol' });
                              }
                            }
                          });
                        }}>
                          <Shield className="h-4 w-4 mr-2" />
                          Cambiar rol
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditForm({
                            idUsuario: u.idUsuario,
                            nombre: u.nombre || "",
                            apellido: u.apellido || "",
                            email: u.email || "",
                            direccion: u.direccion || "",
                            telefono: u.telefono || "",
                          });
                          setEditOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setConfirm({
                            open: true,
                            title: "Eliminar usuario",
                            description: `¿Eliminar a ${formatName(u)}?`,
                            onConfirm: async () => {
                              try {
                                await userService.remove(u.idUsuario);
                                setUsers((prev) => prev.filter((x) => x.idUsuario !== u.idUsuario));
                                toast({ title: "Usuario eliminado", description: formatName(u) || u.email });
                              } catch (e) {
                                setError('No se pudo eliminar el usuario');
                                toast({ title: "Error", description: e?.response?.data?.message || 'No se pudo eliminar el usuario' });
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
                <TableCell colSpan={5} className="text-center py-4">No se encontraron usuarios</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {paged.length} de {total} usuarios
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Por página</label>
          <select
            className="px-2 py-1 border rounded-md"
            value={pageSize}
            onChange={(e) => setPage(Number(e.target.value)) || setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
          <span className="text-sm">{page} / {totalPages}</span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</Button>
        </div>
      </div>
      {/* Confirm dialog reusable */}
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(v) => setConfirm((c) => ({ ...c, open: v }))}
        title={confirm.title}
        description={confirm.description}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirm.onConfirm}
      />
    </div>
  );
}
