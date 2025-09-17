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
import { Search, MoreHorizontal, Eye, Truck, Ban } from "lucide-react";

// Datos de ejemplo para pedidos
const orders = [
  {
    id: "ORD-001",
    customer: "María López",
    email: "maria@example.com",
    date: "2023-05-10",
    total: 3450,
    status: "Completado",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Juan Pérez",
    email: "juan@example.com",
    date: "2023-05-12",
    total: 1800,
    status: "Enviado",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Ana García",
    email: "ana@example.com",
    date: "2023-05-15",
    total: 5200,
    status: "Pendiente",
    items: 3,
  },
  {
    id: "ORD-004",
    customer: "Carlos Rodríguez",
    email: "carlos@example.com",
    date: "2023-05-18",
    total: 950,
    status: "Procesando",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "Laura Martínez",
    email: "laura@example.com",
    date: "2023-05-20",
    total: 2700,
    status: "Cancelado",
    items: 2,
  },
];

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar pedidos según término de búsqueda
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "Completado"
                          ? "bg-green-500"
                          : order.status === "Enviado"
                          ? "bg-blue-500"
                          : order.status === "Pendiente"
                          ? "bg-yellow-500"
                          : order.status === "Procesando"
                          ? "bg-purple-500"
                          : "bg-red-500"
                      }
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Actualizar estado
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Cancelar pedido
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
