import { CheckCircle, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">¡Gracias por tu generosidad!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu donación ya está haciendo la diferencia en la vida de nuestros animales rescatados
          </p>
        </div>

        {/* Donation Summary */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Resumen de tu donación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$2,500</div>
                <p className="text-gray-600">Monto donado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">16</div>
                <p className="text-gray-600">Animales alimentados por un día</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
                <p className="text-gray-600">Vacuna completa cubierta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Animal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conoce a Luna - Rescatada gracias a donantes como tú</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img src="/images/dog1.jpg" alt="Luna, perrita rescatada" className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-gray-700 mb-4">
                  Luna llegó a nosotros hace 3 meses en estado crítico. Gracias a las donaciones de personas generosas
                  como tú, pudimos darle la atención veterinaria que necesitaba. Hoy está completamente recuperada y
                  buscando una familia amorosa.
                </p>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">Recuperada</Badge>
                  <Badge variant="secondary">Sociable</Badge>
                  <Badge variant="secondary">Lista para adopción</Badge>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/adopcion/1">Ver perfil de Luna</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="flex items-center gap-2 bg-transparent">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link to="/adopcion">
              <Heart className="h-4 w-4" />
              Ver animales en adopción
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/donaciones">Hacer otra donación</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
