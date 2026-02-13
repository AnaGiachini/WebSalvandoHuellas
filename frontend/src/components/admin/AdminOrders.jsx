/**
 * Componente AdminOrders
 * -------------------------
 * Gestión de pedidos conectada al backend: listar, ver y actualizar estado/cancelar.
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Search, MoreHorizontal, Eye, Truck, Ban } from "lucide-react";
import ordersService from "../../services/ordersService";
//import Loading from "../ui/Loading";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await ordersService.listAll();
        // Map a estructura de tabla
        const mapped = (list || []).map((o) => {
          const fullName = o.usuario
            ? `${o.usuario.nombre || ''} ${o.usuario.apellido || ''}`.trim()
            : '';
          const email = (o.usuario && o.usuario.email) ? o.usuario.email : (o.email || '');

          return {
            id: o.idCompra,
            // Prioridad: nombre completo > email > fallback "Usuario #id"
            customer: fullName || email || (o.idUsuario ? `Usuario #${o.idUsuario}` : 'N/A'),
            email,
            date: o.fechaCompra,
            total: o.total,
            status: o.estadoPago,
            items: Array.isArray(o.items) ? o.items.length : 0,
            raw: o,
          };
        });
        setOrders(mapped);
      } catch (e) {
        //setError('No se pudieron cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtrar pedidos según término de búsqueda
  const filteredOrders = useMemo(() => orders.filter(
    (order) =>
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  ), [orders, searchTerm]);

  // Formatear fecha (JS)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
    // Nota: si quisieras formato local fijo, puedes usar Intl.DateTimeFormat.
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Cargando...</TableCell></TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.customer}</p>
                      {order.email ? <p className="text-sm text-muted-foreground">{order.email}</p> : null}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={order.status === "pagado" ? "bg-green-600" : order.status === "pendiente" ? "bg-yellow-500" : "bg-red-600"}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const next = order.status === 'pendiente' ? 'pagado' : 'pendiente';
                          setConfirm({
                            open: true,
                            title: "Actualizar estado",
                            description: `Cambiar estado de ${order.status} a ${next}?`,
                            onConfirm: async () => {
                              try {
                                const updated = await ordersService.updateStatus(order.id, next);
                                setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: updated.estadoPago } : o));
                              } catch (e) {
                                // noop simple
                              }
                            }
                          });
                        }}>
                          <Truck className="h-4 w-4 mr-2" />
                          Actualizar estado
                        </DropdownMenuItem>
                        {order.status === 'pendiente' && (
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            setConfirm({
                              open: true,
                              title: "Cancelar pedido",
                              description: `Cancelar compra #${order.id}?`,
                              onConfirm: async () => {
                                try {
                                  const updated = await ordersService.updateStatus(order.id, 'cancelado');
                                  setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: updated.estadoPago } : o));
                                } catch (e) {
                                  // noop simple
                                }
                              }
                            });
                          }}>
                            <Ban className="h-4 w-4 mr-2" />
                            Cancelar pedido
                          </DropdownMenuItem>
                        )}
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
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(v) => setConfirm((c) => ({ ...c, open: v }))}
        title={confirm.title}
        description={confirm.description}
        onConfirm={confirm.onConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Pedido #{selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Detalle de la compra realizada por {selectedOrder.customer}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2 text-sm">
              <div>
                <p className="font-medium">Cliente</p>
                <p>{selectedOrder.customer}</p>
                {selectedOrder.email && (
                  <p className="text-muted-foreground">{selectedOrder.email}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p>{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado de pago</p>
                  <Badge
                    className={
                      selectedOrder.status === "pagado"
                        ? "bg-green-600"
                        : selectedOrder.status === "pendiente"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">${selectedOrder.total.toLocaleString()}</p>
              </div>
              {Array.isArray(selectedOrder.raw?.items) && selectedOrder.raw.items.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Productos</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedOrder.raw.items.map((it, idx) => (
                      <li key={idx}>
                        {it.articulo?.nombre
                          || it.nombreArticulo
                          || it.nombre
                          || `Producto #${it.idArticulo || ''}`} 
                        {" "}
                        <span className="text-xs text-muted-foreground">
                          (x{it.cantidad || 1})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
