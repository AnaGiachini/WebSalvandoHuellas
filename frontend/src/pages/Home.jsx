import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Calendar, ShoppingBag, Info } from "lucide-react";
import FeaturedAnimals from "../components/FeaturedAnimals";
import FeaturedProducts from "../components/FeaturedProducts";
import UpcomingEvents from "../components/UpcomingEvents";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_400px] lg:gap-8 xl:grid-cols-[1fr_520px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Salvando Huellas
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Protectora de animales dedicada al rescate, rehabilitación y
                  adopción de animales abandonados en Jesús María, Córdoba.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link to="/adopcion">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg font-semibold w-full min-[400px]:w-auto"
                  >
                    Adoptar
                  </Button>
                </Link>
                <Link to="/donaciones">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold w-full min-[400px]:w-auto"
                  >
                    Donar
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px] lg:order-last rounded-full shadow-md bg-white flex items-center justify-center">
              <img
                src="/images/logo.jpg"
                alt="Logo Salvando Huellas"
                className="w-[75%] h-[75%] object-contain rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                ¿Cómo puedes ayudar?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hay muchas formas de contribuir a nuestra causa y ayudar a los
                animales necesitados.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 mt-8">
            {/* Adopta */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Adopta</h3>
                <p className="text-sm text-muted-foreground">
                  Dale un hogar a un animal rescatado y cambia su vida para siempre.
                </p>
                <Link to="/adopcion">
                  <Button variant="link" className="text-primary">
                    Conoce más
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Dona */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Donar</h3>
                <p className="text-sm text-muted-foreground">
                  Dona para apoyar a los animales rescatados y su adopción.
                </p>
                <Link to="/donaciones">
                  <Button variant="link" className="text-primary">
                    Conoce más
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Compra */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Compra</h3>
                <p className="text-sm text-muted-foreground">
                  Adquiere productos de nuestra feria americana on-line y apoya nuestra labor.
                </p>
                <Link to="/tienda">
                  <Button variant="link" className="text-primary">
                    Visitar tienda
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Infórmate */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Info className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Infórmate</h3>
                <p className="text-sm text-muted-foreground">
                  Conoce más sobre nuestra labor y cómo puedes ayudar.
                </p>
                <Link to="/informacion">
                  <Button variant="link" className="text-primary">
                    Leer más
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Participa */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Calendar className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Participa</h3>
                <p className="text-sm text-muted-foreground">
                  Asiste a nuestros eventos y actividades de recaudación de fondos.
                </p>
                <Link to="/eventos">
                  <Button variant="link" className="text-primary">
                    Ver eventos
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conoce a algunos de nuestros amigos que buscan un hogar permanente.
              </p>
            </div>
          </div>
          <FeaturedAnimals />
          <div className="flex justify-center mt-8">
            <Link to="/adopcion">
              <Button className="bg-primary hover:bg-primary/90">
                Ver todos los animales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Productos Destacados
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre nuestros productos destacados.
              </p>
            </div>
          </div>
          <FeaturedProducts />
          <div className="flex justify-center mt-8">
            <Link to="/tienda">
              <Button className="bg-primary hover:bg-primary/90">
                Visitar tienda
              </Button>
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
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Participa en nuestras actividades y ayuda a recaudar fondos para nuestra causa.
              </p>
            </div>
          </div>
          <UpcomingEvents />
          <div className="flex justify-center mt-8">
            <Link to="/eventos">
              <Button className="bg-primary hover:bg-primary/90">
                Ver todos los eventos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

