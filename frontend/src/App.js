// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdoptionPage from "./pages/adoption/AdoptionPage";
import AnimalDetail from "./pages/adoption/AnimalDetail";
import StorePage from "./pages/store/StorePage";
import ProductDetail from "./pages/store/ProductDetail";
import CartPage from "./pages/store/CartPage";
import Events from "./pages/Events";
import Information from "./pages/Information";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login"
import AdminAnimals from "./components/admin/AdminAnimals";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminEvents from "./components/admin/AdminEvents";


function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adopcion" element={<AdoptionPage />} />
          <Route path="/adopcion/:id" element={<AnimalDetail />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/tienda/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/informacion" element={<Information />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          {/* Rutas Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/animales" element={<AdminAnimals />} />
          <Route path="/admin/productos" element={<AdminProducts />} />  
          <Route path="/admin/ordenes" element={<AdminOrders />} />
          <Route path="/admin/eventos" element={<AdminEvents />} />

          <Route path="/checkout" element={<div>Checkout (en desarrollo)</div>} />
          <Route path="*" element={<div>Página no encontrada</div>} />
          
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
