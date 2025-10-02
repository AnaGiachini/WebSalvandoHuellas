import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import purchaseService from "../../services/purchaseService";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export default function OrdersDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await purchaseService.getById(id);
        setOrder(data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "No se pudo cargar el pedido");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container py-10">Cargando...</div>;
  if (error) return <div className="container py-10 text-destructive">{error}</div>;
  if (!order) return <div className="container py-10">Pedido no encontrado</div>;

  const items = order.items || [];
  const total = Number(order.total || 0);

  return (
    <div className="container py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Pedido #{order.idCompra}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {new Date(order.fechaCompra).toLocaleString()} · Estado: {order.estadoPago}
            </div>
            <div>
              <Link className="text-primary hover:underline" to="/mis-pedidos">Volver a mis pedidos</Link>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.idItemCompra} className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{it.articulo?.nombre || `Artículo ${it.idArticulo}`}</div>
                  <div className="text-muted-foreground">x{it.cantidad} · ${Number(it.precioUnitario || 0).toLocaleString()}</div>
                </div>
                <div className="font-medium">${Number((it.cantidad || 0) * (it.precioUnitario || 0)).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between font-bold">
            <div>Total</div>
            <div className="text-primary">${total.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
