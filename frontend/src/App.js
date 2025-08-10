import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Router>  
        <div className="flex flex-col min-h-screen">
        {/* <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/tienda/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
