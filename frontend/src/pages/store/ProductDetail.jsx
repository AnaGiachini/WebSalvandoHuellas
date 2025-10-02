import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  ShoppingCart,
  Heart,
  Truck,
  CreditCard,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import RelatedProducts from "../../components/RelatedProducts";
import cartService from "../../services/cartService";
import articlesService from "../../services/articlesService";
import { useAuth } from "../../components/auth/AuthProvider";

/* -------------------- Tabs mínimos (sin dependencias) -------------------- */
function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, { __tabs: { value, setValue } }) : child
  );
}
function TabsList({ className = "", __tabs, children }) {
  return (
    <div className={`grid gap-2 ${className}`} role="tablist">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { __tabs }) : child
      )}
    </div>
  );
}
function TabsTrigger({ value, children, __tabs }) {
  const active = __tabs.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => __tabs.setValue(value)}
      className={`px-3 py-2 text-sm rounded-md border ${
        active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent border-border"
      }`}
    >
      {children}
    </button>
  );
}
function TabsContent({ value, __tabs, className = "", children }) {
  if (__tabs.value !== value) return null;
  return <div className={className}>{children}</div>;
}
/* ------------------------------------------------------------------------ */

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const gallery = [product?.foto || "/placeholder.svg"];

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(product.stock, q + 1));

  const handleShare = async () => {
    const shareData = {
      title: product?.nombre || "Producto",
      text: `Mira este producto: ${product?.nombre || "Producto"}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Enlace copiado al portapapeles");
      }
    } catch {}
  };

  const addToCart = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      const idArticulo = product?.idArticulo || Number(id);
      await cartService.addItem({ idArticulo, cantidad: qty });
      alert("Producto agregado al carrito");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "No se pudo agregar al carrito");
    }
  };

  if (loading) {
    return (
      <div className="container py-8 md:py-12">Cargando producto...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8 md:py-12 text-destructive">{error || 'Producto no encontrado'}</div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Link to="/tienda" className="flex items-center text-primary hover:underline mb-6">
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
              alt={product?.nombre || 'Producto'}
              className="absolute inset-0 object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Galería */}
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image}
                  alt={`${product?.nombre || 'Producto'} - Imagen ${index + 1}`}
                  className="absolute inset-0 object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: Información y compra */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary">{product?.nombre}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Etiquetas opcionales si en el futuro hay categorías o tipo */}
                  {/* <Badge variant="secondary">{product.categoria}</Badge> */}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < Math.floor(product?.rating || 0) ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {/* Placeholder de reseñas deshabilitado por ahora */}
                {/* <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span> */}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-primary">${Number(product?.precio || 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Stock disponible: {product?.stock} unidades</p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="font-medium mb-2">Cantidad</p>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" className="rounded-r-none" onClick={dec}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product?.stock || 1}
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value || 1);
                      if (!Number.isNaN(v)) setQty(Math.min(product?.stock || 1, Math.max(1, v)));
                    }}
                    className="w-16 text-center rounded-none"
                  />
                  <Button variant="outline" size="icon" className="rounded-l-none" onClick={inc}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={addToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar al carrito
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Formas de entrega</p>
                  <p className="text-sm text-muted-foreground">Retiro o coordinación con la protectora</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Métodos de pago</p>
                  <p className="text-sm text-muted-foreground">Mercado Pago y Transferencia bancaria</p>
                </div>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Compra segura</p>
                  <p className="text-sm text-muted-foreground">Tus datos están protegidos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de información */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-4 bg-primary/5 rounded-lg mt-2">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>

            <TabsContent value="features" className="p-4 bg-primary/5 rounded-lg mt-2">
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="specifications" className="p-4 bg-primary/5 rounded-lg mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={index} className="flex flex-col">
                    <p className="text-sm font-medium">{key}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-primary mb-6">Productos relacionados</h2>
        <RelatedProducts category={undefined} currentProductId={product?.idArticulo} />
      </div>
    </div>
  );
}
