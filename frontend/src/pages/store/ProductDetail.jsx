import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
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

// Si ya tienes estos componentes en src/components/ui, usa estos imports.
// Si no, puedes reemplazar por <button>, <input>, etc. con clases Tailwind.
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import RelatedProducts from "../../components/RelatedProducts";

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

// Mock de productos (puedes reemplazarlo por fetch según :id)
const productsById = {
  1: {
    id: 1,
    name: "Alimento Premium para Perros",
    category: "Alimentos",
    price: 2500,
    stock: 15,
    rating: 4.5,
    reviews: 28,
    petType: "Perros",
    brand: "NutriPet",
    weight: "3 kg",
    images: ["/images/product1.jpg", "/images/product1-2.jpg", "/images/product1-3.jpg"],
    description:
      "Alimento balanceado de alta calidad para perros adultos. Formulado con ingredientes naturales y sin conservantes artificiales. Proporciona todos los nutrientes necesarios para mantener a tu mascota saludable y activa.",
    features: [
      "Ingredientes naturales",
      "Sin conservantes artificiales",
      "Rico en proteínas",
      "Con vitaminas y minerales esenciales",
      "Mejora el pelaje y la salud digestiva",
    ],
    specifications: {
      Tipo: "Alimento seco",
      "Edad recomendada": "Adulto",
      "Tamaño de raza": "Todas",
      "Ingredientes principales": "Pollo, arroz, vegetales",
      "Contenido proteico": "25%",
      "Contenido graso": "15%",
      Fibra: "3%",
      Conservación: "Lugar fresco y seco",
    },
  },
  // Puedes añadir más IDs aquí si lo necesitas
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = productsById[id] ?? productsById[1]; // fallback simple
  const [qty, setQty] = useState(1);

  const mainImage = product.images?.[0] ?? "/placeholder.svg";
  const gallery = product.images?.length ? product.images : ["/placeholder.svg"];

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(product.stock, q + 1));

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Mira este producto: ${product.name}`,
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
              alt={product.name}
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
                  alt={`${product.name} - Imagen ${index + 1}`}
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
                <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="outline">{product.petType}</Badge>
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
                      className={`text-lg ${i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Stock disponible: {product.stock} unidades</p>
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
                    max={product.stock}
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value || 1);
                      if (!Number.isNaN(v)) setQty(Math.min(product.stock, Math.max(1, v)));
                    }}
                    className="w-16 text-center rounded-none"
                  />
                  <Button variant="outline" size="icon" className="rounded-l-none" onClick={inc}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
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
                  <p className="font-medium">Envío gratis</p>
                  <p className="text-sm text-muted-foreground">En compras superiores a $5000</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Métodos de pago</p>
                  <p className="text-sm text-muted-foreground">Tarjetas de crédito, débito y transferencia</p>
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
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </div>
  );
}
