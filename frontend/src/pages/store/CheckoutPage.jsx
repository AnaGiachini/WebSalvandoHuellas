import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import cartService from "../../services/cartService";
import purchaseService from "../../services/purchaseService";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cartService.getMyCart();
        setCart(data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, it) => acc + (it.cantidad || 0) * (it.articulo?.precio || 0), 0);
  const shipping = subtotal > 5000 ? 0 : (items.length ? 500 : 0);
  const total = subtotal + shipping;

  const onConfirm = async () => {
    if (!cart?.idCarrito) return;
    try {
      setLoading(true);
      await purchaseService.createFromCart(cart.idCarrito);
      alert("¡Compra realizada con éxito! Puedes ver el detalle en tu perfil.");
      navigate("/perfil");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "No se pudo completar la compra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-8">Cargando...</div>;
  if (error) return <div className="container py-8 text-destructive">{error}</div>;
  if (!items.length) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Agrega productos para continuar con la compra.</p>
        <Link to="/tienda"><Button className="bg-primary">Ir a la tienda</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Columna izquierda: Datos del comprador (placeholder minimal) */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Datos del comprador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" placeholder="Tu nombre" />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" placeholder="Tu apellido" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Calle 123, Ciudad" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Productos</h2>
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.idItemCarrito} className="flex justify-between">
                    <div className="text-sm">
                      <p className="font-medium">{it.articulo?.nombre || `Artículo ${it.idArticulo}`}</p>
                      <p className="text-muted-foreground">x{it.cantidad} · ${Number(it.articulo?.precio || 0).toLocaleString()}</p>
                    </div>
                    <div className="font-medium">${(it.cantidad * (it.articulo?.precio || 0)).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Resumen */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Resumen</h2>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{shipping ? `$${shipping.toLocaleString()}` : "Gratis"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-primary" disabled={loading} onClick={onConfirm}>
                Confirmar compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
