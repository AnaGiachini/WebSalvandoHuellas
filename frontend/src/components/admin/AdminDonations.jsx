/**
 * Componente AdminDonations
 * -------------------------
 * Gestión de donaciones conectada al backend: listar, ver y actualizar estado.
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
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, DollarSign } from "lucide-react";
import donationService from "../../services/donationService";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export default function AdminDonations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, title: "", description: "", onConfirm: null });
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await donationService.listAll();
        // Map a estructura de tabla
        const mapped = (list || []).map((d) => ({
          id: d.idDonacion,
          customer: d.usuario ? `${d.usuario.nombre} ${d.usuario.apellido}` : `Usuario #${d.idUsuario}`,
          email: d.usuario?.email || '',
          date: d.fechaDonacion,
          amount: d.monto,
          status: d.estadoPago,
          method: d.metodoPago || 'N/A',
          raw: d,
        }));
        setDonations(mapped);
      } catch (e) {
        console.error('Error al cargar donaciones:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtrar donaciones según término de búsqueda
  const filteredDonations = useMemo(() => donations.filter(
    (donation) =>
      String(donation.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [donations, searchTerm]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const paid = donations.filter(d => d.status === 'pagado');
    const pending = donations.filter(d => d.status === 'pendiente');
    return {
      total: total.toLocaleString(),
      count: donations.length,
      paid: paid.length,
      paidAmount: paid.reduce((sum, d) => sum + Number(d.amount || 0), 0).toLocaleString(),
      pending: pending.length,
      pendingAmount: pending.reduce((sum, d) => sum + Number(d.amount || 0), 0).toLocaleString(),
    };
  }, [donations]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Donaciones</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar donación..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total donaciones</p>
              <p className="text-2xl font-bold">{stats.count}</p>
              <p className="text-xs text-green-600">${stats.total}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Pagadas</p>
              <p className="text-2xl font-bold text-green-800">{stats.paid}</p>
              <p className="text-xs text-green-600">${stats.paidAmount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              <p className="text-xs text-yellow-600">${stats.pendingAmount}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Promedio</p>
              <p className="text-2xl font-bold text-blue-800">
                ${stats.count > 0 ? Math.round(donations.reduce((sum, d) => sum + Number(d.amount || 0), 0) / stats.count).toLocaleString() : 0}
              </p>
              <p className="text-xs text-blue-600">por donación</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Donante</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Cargando...</TableCell></TableRow>
            ) : filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{donation.customer}</p>
                      {donation.email ? <p className="text-sm text-muted-foreground">{donation.email}</p> : null}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(donation.date)}</TableCell>
                  <TableCell className="font-semibold">${Number(donation.amount).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{donation.method}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        donation.status === "pagado" ? "bg-green-600" : 
                        donation.status === "pendiente" ? "bg-yellow-500" : 
                        "bg-red-600"
                      }
                    >
                      {donation.status}
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
                        <DropdownMenuItem onClick={() => setSelectedDonation(donation)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        
                        {donation.status === 'pendiente' && (
                          <DropdownMenuItem onClick={() => {
                            setConfirm({
                              open: true,
                              title: "Marcar como pagado",
                              description: `¿Confirmar que la donación #${donation.id} de $${Number(donation.amount).toLocaleString()} fue pagada?`,
                              onConfirm: async () => {
                                try {
                                  const updated = await donationService.updateStatus(donation.id, 'pagado');
                                  setDonations((prev) => prev.map((d) => 
                                    d.id === donation.id ? { ...d, status: updated.estadoPago } : d
                                  ));
                                } catch (e) {
                                  alert('Error al actualizar estado');
                                }
                              }
                            });
                          }}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Marcar como pagado
                          </DropdownMenuItem>
                        )}
                        
                        {donation.status !== 'cancelado' && (
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            setConfirm({
                              open: true,
                              title: "Cancelar donación",
                              description: `¿Cancelar donación #${donation.id}?`,
                              onConfirm: async () => {
                                try {
                                  const updated = await donationService.updateStatus(donation.id, 'cancelado');
                                  setDonations((prev) => prev.map((d) => 
                                    d.id === donation.id ? { ...d, status: updated.estadoPago } : d
                                  ));
                                } catch (e) {
                                  alert('Error al cancelar donación');
                                }
                              }
                            });
                          }}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar donación
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
      {selectedDonation && (
        <Dialog open={!!selectedDonation} onOpenChange={(open) => { if (!open) setSelectedDonation(null); }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Donación #{selectedDonation.id}</DialogTitle>
              <DialogDescription>
                Detalle de la donación realizada por {selectedDonation.customer}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2 text-sm">
              <div>
                <p className="font-medium">Donante</p>
                <p>{selectedDonation.customer}</p>
                {selectedDonation.email && (
                  <p className="text-muted-foreground">{selectedDonation.email}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p>{formatDate(selectedDonation.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado de pago</p>
                  <Badge
                    className={
                      selectedDonation.status === "pagado"
                        ? "bg-green-600"
                        : selectedDonation.status === "pendiente"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }
                  >
                    {selectedDonation.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Monto</p>
                  <p className="text-lg font-semibold">${Number(selectedDonation.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Método</p>
                  <p className="capitalize">{selectedDonation.method}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
