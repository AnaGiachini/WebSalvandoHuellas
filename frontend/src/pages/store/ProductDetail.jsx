import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  CreditCard,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import cartService from "../../services/cartService";
import articlesService from "../../services/articlesService";
import { useAuth } from "../../components/auth/AuthProvider";
import { useToast } from "../../hooks/useToast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await articlesService.getById(id);
        setProduct(data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const mainImage = product?.foto || "/placeholder.svg";
  const description = product?.description || product?.descripcion || "Sin descripción disponible.";
  const price = Number(product?.precio ?? 0);
  const stockSafe = Math.max(1, Number(product?.stock ?? 1));

  const categoriaLabel = (() => {
    const cat = product?.categoria;
    if (!cat) return null;
    const map = {
      ropa: "Ropa",
      calzados: "Calzados",
      libros: "Libros",
      accesorios: "Accesorios",
      blancos: "Blancos",
      otros: "Otros",
    };
    return map[cat] || cat;
  })();

  const segmentoLabel = (() => {
    const seg = product?.segmento;
    if (!seg) return null;
    const map = {
      hombre: "Hombre",
      mujer: "Mujer",
      niño: "Niño",
      niña: "Niña",
      unisex: "Unisex",
    };
    return map[seg] || seg;
  })();

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(stockSafe, q + 1));

  const addToCart = async () => {
    try {
      if (!user) {
        const from = window.location.pathname + window.location.search + window.location.hash;
        try {
          localStorage.setItem("postLoginRedirect", from);
        } catch (_e) {}
        navigate('/login', { state: { from } });
        return;
      }
      const idArticulo = product?.idArticulo || Number(id);
      await cartService.addItem({ idArticulo, cantidad: qty });
      toast({
        title: "Producto agregado",
        description: `${qty} ${qty === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito.`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: e?.response?.data?.message || e.message || "No se pudo agregar al carrito",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-8 md:py-12">Cargando producto...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8 md:py-12 text-destructive">
        {error || "Producto no encontrado"}
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Link
        to="/tienda"
        className="flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
        {/* Columna izquierda: Imágenes */}
        <div>
          {/* Imagen principal */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border">
            <img
              src={mainImage}
              alt={product?.nombre || "Producto"}
              className="absolute inset-0 object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Columna derecha: Información y compra */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary">
                  {product?.nombre}
                </h1>
                {(categoriaLabel || segmentoLabel) && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {categoriaLabel && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-primary font-medium">
                        {categoriaLabel}
                      </span>
                    )}
                    {segmentoLabel && (
                      <span className="inline-flex items-center rounded-full bg-secondary/20 px-2 py-1 text-xs text-secondary-foreground">
                        {segmentoLabel}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-3xl font-bold text-primary">
              ${price.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Stock disponible: {stockSafe} {stockSafe === 1 ? "unidad" : "unidades"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="font-medium mb-2">Cantidad</p>
              <div className="inline-flex items-stretch border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-r rounded-none"
                  onClick={dec}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={stockSafe}
                  value={qty}
                  onChange={(e) => {
                    const v = Number(e.target.value || 1);
                    if (!Number.isNaN(v)) {
                      setQty(Math.min(stockSafe, Math.max(1, v)));
                    }
                  }}
                  className="w-20 text-center border-0 rounded-none focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-l rounded-none"
                  onClick={inc}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
            </div>

            <div className="flex gap-4 mt-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 py-3 text-base"
                onClick={addToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Formas de entrega</p>
                <p className="text-sm text-muted-foreground">
                  Retiro o coordinación con la protectora
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Métodos de pago</p>
                <p className="text-sm text-muted-foreground">
                  Mercado Pago y Transferencia bancaria
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Compra segura</p>
                <p className="text-sm text-muted-foreground">
                  Tus datos están protegidos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
