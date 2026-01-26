import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import articlesService from "../services/articlesService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getAll();
        const list = Array.isArray(data) ? data : data?.data || [];
        // Mostramos solo algunos productos destacados en Home
        setProducts(list.slice(0, 4));
        setError("");
      } catch (e) {
        console.error("Error cargando productos destacados", e);
        setError("No pudimos cargar los productos destacados.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Cargando productos destacados...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-8 text-center text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Por el momento no hay productos destacados en la tienda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {products.map((product) => (
        <Card key={product.idArticulo} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={product.foto || "/placeholder.svg"}
              alt={product.nombre}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <Badge className="absolute top-2 right-2 bg-primary">
              {product.categoria || "Producto"}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold line-clamp-1">{product.nombre}</h3>
            {product.descripcion && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.descripcion}
              </p>
            )}
            <p className="mt-2 font-bold text-primary">
              ${Number(product.precio || 0).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link to={`/tienda/${product.idArticulo}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver detalles
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary/90 mt-2" aria-label="Agregar al carrito">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
