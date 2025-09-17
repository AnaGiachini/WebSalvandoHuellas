import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ShoppingCart } from "lucide-react";

// Datos de ejemplo para productos relacionados
const allProducts = [
  {
    id: 1,
    name: "Alimento Premium para Perros",
    category: "Alimentos",
    price: 2500,
    image: "/images/product1.jpg",
    description: "Alimento balanceado de alta calidad para perros adultos.",
  },
  {
    id: 5,
    name: "Alimento Húmedo para Gatos",
    category: "Alimentos",
    price: 1200,
    image: "/images/product5.jpg",
    description: "Alimento húmedo premium para gatos de todas las edades.",
  },
  {
    id: 8,
    name: "Snacks Naturales",
    category: "Alimentos",
    price: 600,
    image: "/images/product8.jpg",
    description: "Snacks naturales y saludables para premiar a tu mascota.",
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
    id: 6,
    name: "Correa Resistente",
    category: "Accesorios",
    price: 850,
    image: "/images/product6.jpg",
    description: "Correa resistente y duradera para paseos seguros.",
  },
];

export default function RelatedProducts({ category, currentProductId }) {
  // Filtrar productos relacionados (misma categoría, excluyendo el producto actual)
  const relatedProducts = allProducts
    .filter(
      (product) => product.category === category && product.id !== currentProductId
    )
    .slice(0, 4); // Limitar a 4 productos

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative aspect-square">
            {/* Sustituye next/image por <img> */}
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
