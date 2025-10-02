import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/mis-pedidos'), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="container py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>¡Gracias por tu compra! 🐾</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Recibirás un correo o mensaje con los puntos de retiro y las instrucciones para coordinar la entrega.
          </p>
          <p className="text-sm text-muted-foreground">
            En unos segundos te redirigiremos a <span className="font-medium">Mis pedidos</span> para que puedas ver el estado de tu compra.
          </p>
          <div className="flex gap-3 pt-2">
            <Button className="bg-primary" onClick={() => navigate('/mis-pedidos')}>Ir a Mis pedidos ahora</Button>
            <Link className="underline text-primary" to="/tienda">Seguir comprando</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
