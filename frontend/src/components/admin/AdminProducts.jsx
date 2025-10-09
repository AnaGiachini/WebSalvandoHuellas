/*
 * Componente AdminProducts
 * -------------------------
 * Gestión de productos conectada al backend (artículos): listar, crear, editar, eliminar.
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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import articlesService from "../../services/articlesService";
import Loading from "../ui/Loading";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "../../hooks/useToast";

export default function AdminProducts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null); // { id, name, price, stock, image, raw }
  const [form, setForm] = useState({ nombre: "", precio: "", stock: "", descripcion: "", foto: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await articlesService.getAll();
        // Backend devuelve array de articulos con campos: idArticulo, nombre, descripcion, precio, stock, foto
        const mapped = (list || []).map((a) => ({
          id: a.idArticulo,
          name: a.nombre,
          category: a.descripcion ? "-" : "-", // no hay categoría en modelo; placeholder
          price: a.precio,
          stock: a.stock,
          image: a.foto,
          raw: a,
        }));
        setProducts(mapped);
      } catch (e) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(product.price).includes(searchTerm) ||
        String(product.stock).includes(searchTerm)
    );
  }, [products, searchTerm]);

  return (
    <div>
      {loading && <Loading />}
      {!!error && (
        <p className="mb-2 text-sm text-red-500" role="alert">{error}</p>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => {
            setEditing(null);
            setForm({ nombre: "", precio: "", stock: "", descripcion: "", foto: "" });
            setOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.stock > 10
                          ? "bg-green-500"
                          : product.stock > 5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {product.stock} unidades
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
                        <DropdownMenuItem onClick={() => window.alert('Próximamente: detalle de producto')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditing(product);
                          setForm({
                            nombre: product.name || "",
                            precio: product.price ?? "",
                            stock: product.stock ?? "",
                            descripcion: product.raw?.descripcion || "",
                            foto: product.image || "",
                          });
                          setOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setConfirm({
                            open: true,
                            title: "Eliminar producto",
                            description: `¿Eliminar "${product.name}"?`,
                            onConfirm: async () => {
                              try {
                                await articlesService.remove(product.id);
                                setProducts((prev) => prev.filter((p) => p.id !== product.id));
                              } catch (e) {
                                setError('No se pudo eliminar el producto');
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
                <TableCell colSpan={5} className="text-center py-4">
                  No se encontraron resultados para "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Modal crear/editar producto */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
              <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <Input placeholder="URL imagen" value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} />
            </div>
            <Input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button disabled={submitting} onClick={async () => {
                setSubmitting(true);
                setError("");
                try {
                  const payload = {
                    nombre: String(form.nombre || "").trim(),
                    precio: Number(form.precio),
                    stock: Number(form.stock),
                    descripcion: form.descripcion || "",
                    foto: form.foto || "",
                  };
                  if (editing) {
                    const updated = await articlesService.update(editing.id, payload);
                    setProducts((prev) => prev.map((p) => p.id === editing.id ? {
                      ...p,
                      name: updated.nombre,
                      price: updated.precio,
                      stock: updated.stock,
                      image: updated.foto,
                      raw: updated,
                    } : p));
                    toast({ title: "Producto actualizado", description: payload.nombre });
                  } else {
                    const created = await articlesService.create(payload);
                    const item = {
                      id: created.idArticulo,
                      name: created.nombre,
                      category: created.descripcion ? '-' : '-',
                      price: created.precio,
                      stock: created.stock,
                      image: created.foto,
                      raw: created,
                    };
                    setProducts((prev) => [item, ...prev]);
                    toast({ title: "Producto creado", description: payload.nombre });
                  }
                  setOpen(false);
                  setEditing(null);
                  setForm({ nombre: "", precio: "", stock: "", descripcion: "", foto: "" });
                } catch (e) {
                  setError(editing ? 'No se pudo actualizar el producto' : 'No se pudo crear el producto');
                } finally {
                  setSubmitting(false);
                }
              }}>{editing ? "Guardar cambios" : "Crear"}</Button>
            </div>
          </div>
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
