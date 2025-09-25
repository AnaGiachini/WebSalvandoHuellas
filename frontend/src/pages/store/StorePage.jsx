// src/pages/StorePage.jsx
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, ShoppingCart } from "lucide-react";
import cartService from "../../services/cartService";
import articlesService from "../../services/articlesService";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/AuthProvider";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await articlesService.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addToCart = async (idArticulo) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await cartService.addItem({ idArticulo, cantidad: 1 });
      alert("Producto agregado al carrito");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "No se pudo agregar al carrito");
    }
  };
  if (loading) {
    return <div className="container py-8 md:py-12">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container py-8 md:py-12 text-destructive">{error}</div>;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Tienda de Productos</h1>
        <p className="text-muted-foreground max-w-3xl">
          Todos los productos de nuestra tienda son de alta calidad y cada compra contribuye a nuestra labor de rescate y cuidado de animales.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-primary/5 rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium">Filtrar productos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="font-medium">Buscar por nombre</label>
            <div className="relative mt-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input id="search" placeholder="Buscar..." className="pl-8 border rounded w-full py-2" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="font-medium">Categoría</label>
            <select id="category" className="mt-1 w-full border rounded p-2">
              <option value="all">Todas</option>
              <option value="food">Alimentos</option>
              <option value="accessories">Accesorios</option>
              <option value="toys">Juguetes</option>
              <option value="hygiene">Higiene</option>
            </select>
          </div>
          <div>
            <label htmlFor="pet-type" className="font-medium">Tipo de mascota</label>
            <select id="pet-type" className="mt-1 w-full border rounded p-2">
              <option value="all">Todas</option>
              <option value="dog">Perros</option>
              <option value="cat">Gatos</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="font-medium">Precio máximo</label>
            <input id="price" type="number" placeholder="Precio máximo" className="mt-1 w-full border rounded p-2" />
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.idArticulo} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-square">
              <img src={product.foto || "/placeholder.svg"} alt={product.nombre} className="object-cover w-full h-full" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.descripcion}</p>
              <p className="mt-2 font-bold text-primary">${Number(product.precio || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <Link to={`/tienda/${product.idArticulo}`} className="flex-1">
                <button className="border border-primary text-primary rounded w-full py-2 hover:bg-primary hover:text-white transition">
                  Ver detalles
                </button>
              </Link>
              <button className="bg-primary text-white rounded p-2 hover:bg-primary/90" onClick={() => addToCart(product.idArticulo)}>
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
