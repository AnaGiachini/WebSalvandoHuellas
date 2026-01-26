import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useToast } from "../../hooks/useToast";
import adoptionApplicationsService from "../../services/adoptionApplicationsService";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function statusBadgeClass(estado) {
  switch (estado) {
    case "pendiente": return "bg-yellow-500";
    case "aprobada": return "bg-green-600";
    case "rechazada": return "bg-red-600";
    default: return "bg-gray-500";
  }
}

export default function MyAdoptions() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({ title: "Necesitas iniciar sesión", description: "Inicia sesión para ver tus solicitudes de adopción." });
        navigate("/login");
        return;
      }
      const decoded = decodeJwt(token);
      const userId = decoded?.idUsuario || decoded?.id || decoded?.sub;
      if (!userId) {
        toast({ title: "Sesión inválida", description: "No pudimos identificar tu usuario. Inicia sesión nuevamente." });
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const data = await adoptionApplicationsService.getByUser(userId);
        const items = Array.isArray(data) ? data : data?.data || [];
        setRequests(items);
      } catch (err) {
        toast({ title: "Error", description: err?.response?.data?.message || "No pudimos cargar tus solicitudes" });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [toast, navigate]);

  const rows = useMemo(() => requests ?? [], [requests]);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Mis solicitudes de adopción</h1>

      {loading ? (
        <div className="text-muted-foreground">Cargando solicitudes...</div>
      ) : rows.length === 0 ? (
        <div className="text-muted-foreground">
          Aún no realizaste solicitudes{" "}
          <Link to="/adopcion" className="text-primary underline">Ver animales en adopción</Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.idSolicitud}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img src={r.animal?.foto || "/placeholder.svg"} alt={r.animal?.nombre || "Animal"} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <p className="font-medium">{r.animal?.nombre || ""}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(r.fechaSolicitud)}</TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass(r.estado)}>{r.estado}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
