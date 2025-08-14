// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RootLayout from "./layouts/RootLayout";

import Home from "./pages/Home";
import AdoptionPage from "./pages/adoption/AdoptionPage";
import AnimalDetail from "./pages/adoption/AnimalDetail";

function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adopcion" element={<AdoptionPage />} />
          <Route path="/adopcion/:id" element={<AnimalDetail />} />

          <Route path="/tienda" element={<div>Página de Tienda (en desarrollo)</div>} />
          <Route path="/tienda/:id" element={<div>Detalle de Producto (en desarrollo)</div>} />
          <Route path="/carrito" element={<div>Carrito (en desarrollo)</div>} />
          <Route path="/checkout" element={<div>Checkout (en desarrollo)</div>} />
          <Route path="/login" element={<div>Login (en desarrollo)</div>} />
          <Route path="/registro" element={<div>Registro (en desarrollo)</div>} />
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
