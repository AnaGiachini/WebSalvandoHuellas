/**
 * Página: CheckoutPage
 * --------------------------------------------------------------------------
 * UC03: Confirmación de compra.
 *
 *  • Responsabilidades
 *      - Verificar que el usuario esté autenticado y tenga carrito con ítems
 *      - Mostrar resumen de productos y datos básicos del comprador
 *      - Permitir elegir el método de pago (Mercado Pago o transferencia)
 *      - Iniciar el flujo de pago correspondiente
 *
 *  • Integraciones
 *      - cartService.getMyCart → obtiene el carrito a convertir en compra
 *      - userService.me       → pre-rellena datos del comprador
 *      - purchaseService.createFromCart → crea compra pendiente (transferencia)
 *      - paymentService.createPreference → crea preferencia de MP y redirige a Mercado Pago
 */

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import purchaseService from "../../services/purchaseService";
import paymentService from "../../services/paymentService";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import userService from "../../services/userService";
import { useAuth } from "../../components/auth/AuthProvider";
import cartService from "../../services/cartService";
import { useToast } from "../../hooks/useToast";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago');
  const [buyerName, setBuyerName] = useState("");
  const [buyerLast, setBuyerLast] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  // Dirección no se usa en checkout según requerimiento
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Guardar de sesión: si no hay usuario, ir a login
        if (!user) {
          navigate('/login');
          return;
        }
        const data = await cartService.getMyCart();
        setCart(data);
        // Si el carrito no tiene items, redirigir a carrito
        if (!data?.items || data.items.length === 0) {
          navigate('/carrito');
          return;
        }
        // Prefill datos del comprador desde el perfil
        try {
          const me = await userService.me();
          setBuyerName(me?.nombre || "");
          setBuyerLast(me?.apellido || "");
          setBuyerEmail(me?.email || "");
        } catch {}
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, it) => acc + (it.cantidad || 0) * (it.articulo?.precio || 0), 0);
  const total = subtotal; // Sin flete ni descuentos

  /**
   * Confirma la compra según el método de pago seleccionado.
   * --------------------------------------------------------------------------
   *  • Mercado Pago
   *      - Llama a paymentService.createPreference({ idCarrito })
   *      - Redirige al usuario al checkout de Mercado Pago (init_point)
   *
   *  • Transferencia
   *      - Crea la compra en estado 'pendiente' con metodoPago='transferencia'
   *      - Muestra instrucciones de pago y vacía el carrito local
   */
  const onConfirm = async () => {
    if (!cart?.idCarrito) return;
    try {
      setLoading(true);
      if (paymentMethod === 'mercado_pago') {
        const { init_point } = await paymentService.createPreference({ idCarrito: cart.idCarrito });
        if (init_point) {
          window.location.href = init_point;
          return;
        }
      } else if (paymentMethod === 'transferencia') {
        await purchaseService.createFromCart({ idCarrito: cart.idCarrito, metodoPago: 'transferencia' });
        toast({
          title: "Compra generada",
          description: "Tu compra está en estado pendiente. Por favor, realiza la transferencia bancaria según los datos mostrados.",
        });
        // Vaciar carrito inmediatamente para una mejor UX en el caso de transferencia
        try { await cartService.clearCart(); } catch {}
        navigate("/gracias");
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso de pago",
        variant: "destructive"
      });
    } catch (e) {
      toast({
        title: "Error al procesar compra",
        description: e?.response?.data?.message || e.message || "No se pudo completar la compra",
        variant: "destructive"
      });
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
                  <Input id="nombre" value={buyerName} readOnly disabled placeholder="Tu nombre" />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" value={buyerLast} readOnly disabled placeholder="Tu apellido" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={buyerEmail} readOnly disabled placeholder="tu@email.com" />
                </div>
              </div>
              <div className="rounded-md border p-4 bg-primary/5 text-sm text-muted-foreground">
                Al completar tu compra te enviaremos por correo electrónico o mensaje los puntos de retiro disponibles y las instrucciones para coordinar la entrega.
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

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Método de pago</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="mercado_pago"
                    checked={paymentMethod === 'mercado_pago'}
                    onChange={() => setPaymentMethod('mercado_pago')}
                  />
                  <span>Mercado Pago</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={paymentMethod === 'transferencia'}
                    onChange={() => setPaymentMethod('transferencia')}
                  />
                  <span>Transferencia bancaria</span>
                </label>
              </div>

              {paymentMethod === 'transferencia' && (
                <div className="mt-4 rounded-md border p-4 bg-primary/5">
                  <p className="font-medium mb-2">Datos para la transferencia</p>
                  <ul className="text-sm space-y-1">
                    <li><span className="font-medium">Alias:</span> salvandohuellas.jm</li>
                    <li><span className="font-medium">CVU:</span> 0000003100064017923408</li>
                    <li><span className="font-medium">Nombre:</span> Mara Emma Giachini</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">Una vez realizada la transferencia, por favor envíanos el comprobante. Al acreditarse, se confirmará tu compra.</p>
                </div>
              )}
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
