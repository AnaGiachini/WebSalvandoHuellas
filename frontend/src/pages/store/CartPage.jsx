import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import { useAuth } from "../../components/auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";


export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const cartItems = (cart?.items || []).map((it) => ({
    id: it.idItemCarrito,
    name: it.articulo?.nombre ?? `Artículo ${it.idArticulo}`,
    price: it.articulo?.precio ?? 0,
    quantity: it.cantidad ?? 0,
    image: it.articulo?.foto ?? "/placeholder.svg",
    _raw: it,
  }));

  const refreshCart = async () => {
    try {
      const data = await cartService.getMyCart();
      setCart(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al actualizar el carrito");
    }
  };

  const handleUpdateQty = async (idItemCarrito, newQty) => {
    try {
      if (newQty <= 0) {
        // si llega 0, eliminamos el ítem
        await cartService.removeItem(idItemCarrito);
      } else {
        await cartService.updateItem(idItemCarrito, newQty);
      }
      await refreshCart();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'No se pudo actualizar la cantidad');
    }
  };

  const handleRemove = async (idItemCarrito) => {
    try {
      await cartService.removeItem(idItemCarrito);
      await refreshCart();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'No se pudo eliminar el ítem');
    }
  };

  if (loading) return <div className="container py-8">Cargando...</div>;
  if (error) return <div className="container py-8 text-destructive">{error}</div>;

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  // Calcular envío (gratis si el subtotal es mayor a 5000)
  const shipping = subtotal > 5000 ? 0 : (cartItems.length ? 500 : 0);
  // Calcular total
  const total = subtotal + shipping;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Carrito de Compras
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Revisa los productos seleccionados y procede al pago para finalizar tu
          compra.
        </p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Columna izquierda: Productos */}
          <div>
            <div className="bg-primary/5 rounded-lg p-4 mb-4 flex justify-between items-center">
              <h2 className="font-medium">Productos ({cartItems.length})</h2>
              <Link to="/tienda">
                <Button variant="link" className="text-primary p-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Seguir comprando
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex p-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toLocaleString()} c/u
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="w-12 h-8 text-center rounded-none"
                            readOnly
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-medium text-primary">
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Columna derecha: Resumen y pago */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>
                      {shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toLocaleString()}</span>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="w-full space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      if (!user) return navigate('/login');
                      navigate("/checkout");
                    }}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceder al pago
                  </Button>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Pago seguro y encriptado
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // Carrito vacío
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Parece que aún no has añadido productos a tu carrito.
          </p>
          <Link to="/tienda">
            <Button className="bg-primary hover:bg-primary/90">Ir a la tienda</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 