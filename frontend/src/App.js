// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RootLayout from "./layouts/RootLayout";
import RequireAdmin from "./components/auth/RequireAdmin";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdoptionPage from "./pages/adoption/AdoptionPage";
import AnimalDetail from "./pages/adoption/AnimalDetail";
import StorePage from "./pages/store/StorePage";
import ProductDetail from "./pages/store/ProductDetail";
import CartPage from "./pages/store/CartPage";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Information from "./pages/Information";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import AdminAnimals from "./components/admin/AdminAnimals";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminEvents from "./components/admin/AdminEvents";
import Donaciones from "./pages/donations/Donaciones";
import AdminAdoptions from "./components/admin/AdminAdoptions";
import Profile from "./pages/Profile";
import OrdersList from "./pages/orders/OrdersList";
import OrdersDetail from "./pages/orders/OrdersDetail";
import ThankYou from "./pages/orders/ThankYou";
import MyDonations from "./pages/donations/MyDonations";
import SocialCallback from "./pages/auth/SocialCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MyAdoptions from "./pages/adoption/MyAdoptions";
import CheckoutPage from "./pages/store/CheckoutPage";

function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adopcion" element={<AdoptionPage />} />
          <Route path="/adopcion/:id" element={<AnimalDetail />} />
          <Route path="/mis-solicitudes" element={<MyAdoptions />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/tienda/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/eventos/:id" element={<EventDetail />} />
          <Route path="/informacion" element={<Information />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/donaciones" element={<Donaciones />} />  
          <Route path="/mis-donaciones" element={<MyDonations />} />
          <Route path="/perfil" element={<Profile />} />         
          <Route path="/mis-pedidos" element={<OrdersList />} />
          <Route path="/mis-pedidos/:id" element={<OrdersDetail />} />
          <Route path="/gracias" element={<ThankYou />} />
          <Route path="/donaciones/gracias" element={<ThankYou />} />
          <Route path="/auth/callback" element={<SocialCallback />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Rutas Admin (protegidas) */}
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/admin/animales" element={<RequireAdmin><AdminAnimals /></RequireAdmin>} />
          <Route path="/admin/productos" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />  
          <Route path="/admin/ordenes" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
          <Route path="/admin/eventos" element={<RequireAdmin><AdminEvents /></RequireAdmin>} />
          <Route path="/admin/adopciones" element={<RequireAdmin><AdminAdoptions /></RequireAdmin>} />   

          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
