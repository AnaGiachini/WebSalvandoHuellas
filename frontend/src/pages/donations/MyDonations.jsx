import { useEffect, useMemo, useState } from "react";
import donationService from "../../services/donationService";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyDonations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const list = await donationService.myDonations();
        setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'No se pudieron cargar tus donaciones');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pageItems = useMemo(() => items.slice(pageStart, pageEnd), [items, pageStart, pageEnd]);

  useEffect(() => {
    // si cambia el tamaño de página y deja fuera la página actual, corrige la página
    if (currentPage > totalPages) setPage(totalPages);
  }, [currentPage, totalPages]);

  if (loading) return <div className="container py-8">Cargando...</div>;
  if (error) return <div className="container py-8 text-destructive">{error}</div>;

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis donaciones</h1>
        <Button onClick={() => navigate('/donaciones')}>Hacer una donación</Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Aún no registras donaciones.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Controles de paginación (arriba) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Mostrando {Math.min(total, pageEnd)} de {total}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm">Por página:</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p-1))}>Anterior</Button>
                <span className="text-sm">Página {currentPage} de {totalPages}</span>
                <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Siguiente</Button>
              </div>
            </div>
          </div>

          {pageItems.map((d) => (
            <Card key={d.idDonacion}>
              <CardHeader>
                <CardTitle className="text-base">Donación #{d.idDonacion}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Fecha</div>
                  <div>{new Date(d.fechaDonacion).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Monto</div>
                  <div>${Number(d.monto || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Estado</div>
                  <div className="capitalize">{d.estadoPago}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Método</div>
                  <div className="capitalize">{d.metodoPago || '-'}</div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Controles de paginación (abajo) */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p-1))}>Anterior</Button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Siguiente</Button>
          </div>
        </div>
      )}
    </div>
  );
}
