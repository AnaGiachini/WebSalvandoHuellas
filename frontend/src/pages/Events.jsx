import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

// Datos de ejemplo para eventos
const events = [
  {
    id: 1,
    title: "Jornada de Adopción",
    date: "2023-06-15",
    time: "10:00 - 18:00",
    location: "Plaza Central, Jesús María",
    image: "/images/event1.jpg",
    description:
      "Ven a conocer a nuestros animales en adopción y encuentra a tu compañero ideal. Tendremos perros y gatos de todas las edades buscando un hogar.",
  },
  {
    id: 2,
    title: "Campaña de Vacunación",
    date: "2023-06-22",
    time: "09:00 - 14:00",
    location: "Sede Salvando Huellas",
    image: "/images/event2.jpg",
    description:
      "Vacunación gratuita para perros y gatos. Trae a tu mascota y mantén sus vacunas al día. Servicio de desparasitación también disponible.",
  },
  {
    id: 3,
    title: "Taller de Adiestramiento",
    date: "2023-06-29",
    time: "16:00 - 18:00",
    location: "Parque Municipal",
    image: "/images/event3.jpg",
    description:
      "Aprende técnicas básicas de adiestramiento para mejorar la convivencia con tu mascota. Impartido por adiestradores profesionales.",
  },
  {
    id: 4,
    title: "Feria de Adopción",
    date: "2023-07-10",
    time: "11:00 - 19:00",
    location: "Centro Comercial",
    image: "/images/event4.jpg",
    description:
      "Gran feria de adopción con actividades para toda la familia. Habrá stands informativos, juegos, y por supuesto, muchos animales esperando ser adoptados.",
  },
  {
    id: 5,
    title: "Charla sobre Tenencia Responsable",
    date: "2023-07-15",
    time: "18:00 - 20:00",
    location: "Biblioteca Municipal",
    image: "/images/event5.jpg",
    description:
      "Charla educativa sobre la tenencia responsable de mascotas. Aprende sobre cuidados básicos, alimentación, y responsabilidades como dueño de una mascota.",
  },
  {
    id: 6,
    title: "Caminata Solidaria",
    date: "2023-07-22",
    time: "09:00 - 12:00",
    location: "Parque Central",
    image: "/images/event6.jpg",
    description:
      "Caminata solidaria con tu mascota para recaudar fondos para nuestra protectora. Inscripción previa requerida. Habrá premios y sorpresas.",
  },
];

export default function EventsPage() {
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Separar eventos próximos y pasados (comparación por día)
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= todayMidnight
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < todayMidnight
  );

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Eventos y Actividades</h1>
        <p className="text-muted-foreground max-w-3xl">
          Participa en nuestros eventos y actividades para apoyar nuestra causa. Desde jornadas de adopción hasta
          talleres educativos, siempre hay algo para todos.
        </p>
      </div>

      {/* Eventos próximos */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/eventos/${event.id}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Más información
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Eventos pasados */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Eventos Pasados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden opacity-75">
              <div className="relative aspect-video">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/eventos/${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver resumen
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Suscripción a eventos */}
      <div className="mt-16 bg-primary/5 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          ¿Quieres estar al tanto de nuestros eventos?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Suscríbete a nuestro boletín para recibir información sobre próximos eventos y actividades. No te pierdas la
          oportunidad de participar y ayudar a nuestra causa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="px-4 py-2 rounded-md border border-input bg-background"
          />
          <Button className="bg-primary hover:bg-primary/90">Suscribirse</Button>
        </div>
      </div>
    </div>
  );
}
