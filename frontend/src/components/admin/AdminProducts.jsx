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
  const [form, setForm] = useState({ nombre: "", precio: "", stock: "", descripcion: "", foto: "", categoria: "", segmento: "", descuento: "", variantes: "", activo: true });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await articlesService.getAll();
        // Backend devuelve array de articulos con campos: idArticulo, nombre, descripcion, precio, stock, foto
        const mapped = (list || []).map((a) => ({
          id: a.idArticulo,
          name: a.nombre,
          category: a.categoria || "-",
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
            setForm({ nombre: "", precio: "", stock: "", descripcion: "", foto: "", categoria: "", segmento: "", descuento: "", variantes: "", activo: true });
            setPhotoFile(null);
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
                  <TableCell>
                    {(() => {
                      const d = Number(product.raw?.descuento || 0);
                      const hasDiscount = !isNaN(d) && d > 0;
                      const finalPrice = hasDiscount ? product.price * (1 - d / 100) : product.price;
                      return (
                        <div className="flex flex-col">
                          <span className="font-medium">${finalPrice.toLocaleString()}</span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">${product.price.toLocaleString()} ({d}% off)</span>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => window.alert("Próximamente: detalle de producto")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(product);
                            setForm({
                              nombre: product.name || "",
                              precio: product.price ?? "",
                              stock: product.stock ?? "",
                              descripcion: product.raw?.descripcion || "",
                              foto: product.image || "",
                              categoria: product.raw?.categoria || "",
                              segmento: product.raw?.segmento || "",
                              descuento: product.raw?.descuento ?? "",
                              variantes: product.raw?.variantes || "",
                              activo: product.raw?.activo !== undefined ? !!product.raw.activo : true,
                            });
                            setPhotoFile(null);
                            setOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setConfirm({
                              open: true,
                              title: "Eliminar producto",
                              description: `¿Eliminar "${product.name}"?`,
                              onConfirm: async () => {
                                try {
                                  await articlesService.remove(product.id);
                                  setProducts((prev) => prev.filter((p) => p.id !== product.id));
                                } catch (e) {
                                  setError("No se pudo eliminar el producto");
                                }
                              },
                            });
                          }}
                        >
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
            <Input
              placeholder="Nombre del producto (ej: Campera de jean)"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                type="number"
                step="0.01"
                placeholder="Precio (ej: 1200)"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Stock disponible (ej: 10)"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
              <Input
                placeholder="URL imagen (opcional si subís archivo)"
                value={form.foto}
                onChange={(e) => setForm({ ...form, foto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="product-photo" className="text-sm font-medium">
                  Foto (archivo)
                </label>
                <Input
                  id="product-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPhotoFile(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Si seleccionas un archivo, se subirá a Cloudinary y se usará su URL.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Categoría</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                >
                  <option value="">Sin categoría</option>
                  <option value="ropa">Ropa</option>
                  <option value="calzados">Calzados</option>
                  <option value="libros">Libros</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="blancos">Blancos</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Segmento</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={form.segmento}
                  onChange={(e) => setForm({ ...form, segmento: e.target.value })}
                >
                  <option value="">General / No aplica</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="niño">Niño</option>
                  <option value="niña">Niña</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              {/* Campo de descuento ocultado por ahora, no se usa en la venta */}
              <div className="flex items-center gap-2">
                <input
                  id="activo"
                  type="checkbox"
                  checked={!!form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                <label htmlFor="activo" className="text-sm">
                  Activo
                </label>
              </div>
            </div>
            <Input
              placeholder="Descripción del producto (ej: Remera de algodón, talle M)"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
            {/* Campo de variantes ocultado para no complicar la carga en esta versión */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                disabled={submitting}
                onClick={async () => {
                  setSubmitting(true);
                  setError("");
                  try {
                    const payload = {
                      nombre: String(form.nombre || "").trim(),
                      precio: Number(form.precio),
                      stock: Number(form.stock),
                      descripcion: form.descripcion || "",
                      foto: form.foto || "",
                      categoria: form.categoria || "",
                      // Si no se eligió segmento, no mandar string vacío (ENUM no lo acepta)
                      segmento: form.segmento || null,
                      descuento: form.descuento === "" ? undefined : Number(form.descuento),
                      variantes: form.variantes || "",
                      activo: !!form.activo,
                    };

                    // Si el admin seleccionó un archivo, subir primero a Cloudinary
                    if (photoFile) {
                      const url = await articlesService.uploadPhoto(photoFile);
                      if (url) {
                        payload.foto = url;
                      }
                    }

                    if (editing) {
                      const updated = await articlesService.update(editing.id, payload);
                      setProducts((prev) =>
                        prev.map((p) =>
                          p.id === editing.id
                            ? {
                                ...p,
                                name: updated.nombre,
                                price: updated.precio,
                                stock: updated.stock,
                                image: updated.foto,
                                category: updated.categoria || "-",
                                raw: updated,
                              }
                            : p
                        )
                      );
                      toast({ title: "Producto actualizado", description: payload.nombre });
                    } else {
                      const created = await articlesService.create(payload);
                      const item = {
                        id: created.idArticulo,
                        name: created.nombre,
                        category: created.categoria || "-",
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
                    setForm({
                      nombre: "",
                      precio: "",
                      stock: "",
                      descripcion: "",
                      foto: "",
                      categoria: "",
                      segmento: "",
                      descuento: "",
                      variantes: "",
                      activo: true,
                    });
                    setPhotoFile(null);
                  } catch (e) {
                    setError(
                      editing
                        ? "No se pudo actualizar el producto"
                        : "No se pudo crear el producto"
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {editing ? "Guardar cambios" : "Crear"}
              </Button>
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
