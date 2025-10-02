import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import purchaseService from "../../services/purchaseService";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export default function OrdersList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await purchaseService.getMine();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "No se pudieron cargar tus compras");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="container py-10">Cargando...</div>;
  if (error) return <div className="container py-10 text-destructive">{error}</div>;

  return (
    <div className="container py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Mis pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-muted-foreground">Aún no tienes compras realizadas.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.idCompra} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Pedido #{o.idCompra}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(o.fechaCompra).toLocaleString()} · Estado: {o.estadoPago}
                      </div>
                    </div>
                    <div className="text-primary font-semibold">${Number(o.total || 0).toLocaleString()}</div>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray(o.items) && o.items.length > 0
                      ? `${o.items.length} artículo(s)`
                      : "Sin ítems"}
                  </div>
                  <div className="mt-3">
                    <Link className="text-primary hover:underline" to={`/mis-pedidos/${o.idCompra}`}>Ver detalle</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
