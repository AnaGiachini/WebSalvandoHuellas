import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ShoppingCart } from "lucide-react";

// Datos de ejemplo para productos
const featuredProducts = [
  {
    id: 1,
    name: "Alimento Premium para Perros",
    category: "Alimentos",
    price: 2500,
    image: "/images/product1.jpg",
    description: "Alimento balanceado de alta calidad para perros adultos.",
  },
  {
    id: 2,
    name: "Cama para Gatos",
    category: "Accesorios",
    price: 1800,
    image: "/images/product2.jpg",
    description: "Cama suave y cómoda para gatos de todos los tamaños.",
  },
  {
    id: 3,
    name: "Juguete Interactivo",
    category: "Juguetes",
    price: 950,
    image: "/images/product3.jpg",
    description: "Juguete interactivo para mantener a tu mascota entretenida.",
  },
  {
    id: 4,
    name: "Collar Personalizado",
    category: "Accesorios",
    price: 750,
    image: "/images/product4.jpg",
    description: "Collar ajustable y personalizable para perros y gatos.",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative aspect-square">
            {/* Sustituimos next/image por img normal */}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <Badge className="absolute top-2 right-2 bg-primary">
              {product.category}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
            <p className="mt-2 font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link to={`/tienda/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver detalles
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
