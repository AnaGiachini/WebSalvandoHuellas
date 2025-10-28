/**
 * Componente AdminAdoptions
 * -------------------------
 * Muestra una lista de solicitudes de adopción
 * con opciones para aprobar, rechazar y eliminar.
 */
import { useEffect, useState, useCallback } from "react"
import {
  Search, MoreHorizontal, Eye, Check, X, Calendar, User, Heart,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdownMenu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { useToast } from "../../hooks/useToast"
import adoptionApplicationsService from "../../services/adoptionApplicationsService"

export default function AdminAdoptions() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await adoptionApplicationsService.getAll()
      // El servicio devuelve lista directa o { data }
      const items = Array.isArray(data) ? data : data?.data || []
      setRequests(items)
      setError(null)
    } catch (err) {
      setError("No pudimos cargar las solicitudes")
      toast({ title: "Error", description: err?.response?.data?.message || "Error al obtener solicitudes" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  const filteredRequests = requests.filter((r) => {
    const term = searchTerm.toLowerCase()
    const id = String(r.idSolicitud)
    const solicitante = r.usuario?.nombre ? `${r.usuario.nombre} ${r.usuario.apellido || ""}`.trim() : ""
    const animalNombre = r.animal?.nombre || ""
    const email = r.usuario?.email || ""
    return [id, solicitante, animalNombre, email].some((field) => field.toLowerCase().includes(term))
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
  }

  const getStatusBadgeColor = (estado) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-500"
      case "aprobada": return "bg-green-600"
      case "rechazada": return "bg-red-600"
      default: return "bg-gray-500"
    }
  }

  const onApprove = async (req) => {
    try {
      await adoptionApplicationsService.updateStatus(req.idSolicitud, "aprobada")
      toast({ title: "Aprobada", description: `Solicitud #${req.idSolicitud} aprobada. El animal pasa a 'adoptado'.` })
      load()
    } catch (err) {
      toast({ title: "Error al aprobar", description: err?.response?.data?.message || "No se pudo aprobar" })
    }
  }

  const onReject = async (req) => {
    try {
      await adoptionApplicationsService.updateStatus(req.idSolicitud, "rechazada")
      toast({ title: "Rechazada", description: `Solicitud #${req.idSolicitud} rechazada. El animal vuelve a 'disponible'.` })
      load()
    } catch (err) {
      toast({ title: "Error al rechazar", description: err?.response?.data?.message || "No se pudo rechazar" })
    }
  }

  const onDelete = async (req) => {
    if (!window.confirm(`¿Eliminar la solicitud #${req.idSolicitud}?`)) return
    try {
      await adoptionApplicationsService.remove(req.idSolicitud)
      toast({ title: "Eliminada", description: `Solicitud #${req.idSolicitud} eliminada` })
      load()
    } catch (err) {
      toast({ title: "Error al eliminar", description: err?.response?.data?.message || "No se pudo eliminar" })
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Adopciones</h2>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar solicitud..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Cargando...</TableCell></TableRow>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.idSolicitud}>
                  <TableCell className="font-medium">{request.idSolicitud}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.usuario ? `${request.usuario.nombre} ${request.usuario.apellido || ""}` : ""}</p>
                      <p className="text-sm text-muted-foreground">{request.usuario?.email || ""}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={request.animal?.foto || "/placeholder.svg"}
                          alt={request.animal?.nombre || "Animal"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{request.animal?.nombre || ""}</p>
                        <p className="text-sm text-muted-foreground">ID: {request.idAnimal}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.fechaSolicitud ? formatDate(request.fechaSolicitud) : ""}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(request.estado)}>{request.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        {request.estado === "pendiente" && (
                          <>
                            <DropdownMenuItem onClick={() => onApprove(request)}>
                              <Check className="h-4 w-4 mr-2" />
                              Aprobar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onReject(request)}>
                              <X className="h-4 w-4 mr-2" />
                              Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(request)}>
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

      {/* Dialog Detalle */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Solicitud de Adopción - #{selectedRequest.idSolicitud}
              </DialogTitle>
              <DialogDescription>Detalles completos de la solicitud</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solicitante */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Solicitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedRequest.nombre} {selectedRequest.apellido}
                    </p>
                    <p className="text-sm text-muted-foreground">ID Usuario: {selectedRequest.idUsuario}</p>
                  </div>
                  
                  <Separator />
                  
                  {/* Datos al momento de la solicitud */}
                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">📸 Datos al momento de la solicitud:</p>
                    <div className="space-y-2 bg-primary/5 p-3 rounded-md">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Teléfono</p>
                        <p className="text-sm">{selectedRequest.telefono}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Dirección</p>
                        <p className="text-sm">{selectedRequest.direccion}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Datos actuales del usuario */}
                  {selectedRequest.usuario && (
                    <div>
                      <p className="text-sm font-semibold text-green-600 mb-2">✓ Datos actuales para contacto:</p>
                      <div className="space-y-2 bg-green-50 p-3 rounded-md">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email actual</p>
                          <p className="text-sm font-medium">{selectedRequest.usuario.email}</p>
                          {selectedRequest.usuario.email !== selectedRequest.email && (
                            <p className="text-xs text-orange-600">⚠️ Cambió su email</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Teléfono actual</p>
                          <p className="text-sm font-medium">{selectedRequest.usuario.telefono}</p>
                          {selectedRequest.usuario.telefono !== selectedRequest.telefono && (
                            <p className="text-xs text-orange-600">⚠️ Cambió su teléfono</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Dirección actual</p>
                          <p className="text-sm font-medium">{selectedRequest.usuario.direccion}</p>
                          {selectedRequest.usuario.direccion !== selectedRequest.direccion && (
                            <p className="text-xs text-orange-600">⚠️ Cambió su dirección</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Experiencia y motivación */}
                  {selectedRequest.experienciaPrevia && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Experiencia con mascotas</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.experienciaPrevia}</p>
                    </div>
                  )}
                  {selectedRequest.motivacion && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Motivación</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.motivacion}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Solicitud: {selectedRequest.fechaSolicitud ? formatDate(selectedRequest.fechaSolicitud) : ""}</span>
                  </div>
                  <div>
                    <Badge className={getStatusBadgeColor(selectedRequest.estado)}>{selectedRequest.estado}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Animal */}
              <Card>
                <CardHeader>
                  <CardTitle>Animal Solicitado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={selectedRequest.animal?.foto || "/placeholder.svg"}
                        alt={selectedRequest.animal?.nombre || "Animal"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedRequest.animal?.nombre || ""}</h3>
                      <p className="text-muted-foreground">ID: {selectedRequest.idAnimal}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {selectedRequest.estado === "pendiente" && (
                <>
                  <Button variant="outline" className="text-red-600 border-red-600" onClick={() => onReject(selectedRequest)}>
                    <X className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(selectedRequest)}>
                    <Check className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
