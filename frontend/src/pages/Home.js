// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
// Importamos íconos desde react-icons (alternativa a lucide-react)
import { FaHeart, FaCalendarAlt, FaShoppingBag, FaInfoCircle } from 'react-icons/fa';

// Estos componentes los crearemos después
// import FeaturedAnimals from '../components/FeaturedAnimals';
// import FeaturedProducts from '../components/FeaturedProducts';
// import UpcomingEvents from '../components/UpcomingEvents';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Salvando Huellas
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Protectora de animales dedicada al rescate, rehabilitación y adopción de animales abandonados en Jesús
                  María, Córdoba.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/adopcion">
                  <button className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded">
                    Adoptar
                  </button>
                </Link>
                <Link to="/donaciones">
                  <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded">
                    Donar
                  </button>
                </Link>
              </div>
            </div>
            <img
              src="/images/hero-image.jpg"
              alt="Perros y gatos rescatados"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                ¿Cómo puedes ayudar?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hay muchas formas de contribuir a nuestra causa y ayudar a los animales necesitados.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            <div className="border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg">
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <FaHeart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Adopta</h3>
                <p className="text-sm text-gray-500">
                  Dale un hogar a un animal rescatado y cambia su vida para siempre.
                </p>
                <Link to="/adopcion" className="text-primary">
                  Conoce más
                </Link>
              </div>
            </div>
            <div className="border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg">
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <FaShoppingBag className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Compra</h3>
                <p className="text-sm text-gray-500">
                  Adquiere productos para tu mascota y apoya nuestra labor.
                </p>
                <Link to="/tienda" className="text-primary">
                  Visitar tienda
                </Link>
              </div>
            </div>
            <div className="border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg">
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <FaCalendarAlt className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Participa</h3>
                <p className="text-sm text-gray-500">
                  Asiste a nuestros eventos y actividades de recaudación de fondos.
                </p>
                <Link to="/eventos" className="text-primary">
                  Ver eventos
                </Link>
              </div>
            </div>
            <div className="border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg">
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <FaInfoCircle className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Infórmate</h3>
                <p className="text-sm text-gray-500">
                  Conoce más sobre nuestra labor y cómo puedes ayudar.
                </p>
                <Link to="/informacion" className="text-primary">
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Animales en Adopción
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conoce a algunos de nuestros amigos que buscan un hogar permanente.
              </p>
            </div>
          </div>
          {/* <FeaturedAnimals /> */}
          <div className="flex justify-center mt-8">
            <Link to="/adopcion">
              <button className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded">
                Ver todos los animales
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Productos Destacados
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre nuestra selección de productos para tus mascotas.
              </p>
            </div>
          </div>
          {/* <FeaturedProducts /> */}
          <div className="flex justify-center mt-8">
            <Link to="/tienda">
              <button className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded">
                Visitar tienda
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Próximos Eventos
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Participa en nuestras actividades y ayuda a recaudar fondos para nuestra causa.
              </p>
            </div>
          </div>
          {/* <UpcomingEvents /> */}
          <div className="flex justify-center mt-8">
            <Link to="/eventos">
              <button className="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded">
                Ver todos los eventos
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;