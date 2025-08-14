// /frontend/src/components/UpcomingEvents.jsx
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

// Datos de ejemplo para eventos
const upcomingEvents = [
  {
    id: 1,
    title: "Jornada de Adopción",
    date: "2023-06-15",
    time: "10:00 - 18:00",
    location: "Plaza Central, Jesús María",
    image: "/images/event1.jpg",
    description:
      "Ven a conocer a nuestros animales en adopción y encuentra a tu compañero ideal.",
  },
  {
    id: 2,
    title: "Campaña de Vacunación",
    date: "2023-06-22",
    time: "09:00 - 14:00",
    location: "Sede Salvando Huellas",
    image: "/images/event2.jpg",
    description:
      "Vacunación gratuita para perros y gatos. Trae a tu mascota y mantén sus vacunas al día.",
  },
  {
    id: 3,
    title: "Taller de Adiestramiento",
    date: "2023-06-29",
    time: "16:00 - 18:00",
    location: "Parque Municipal",
    image: "/images/event3.jpg",
    description:
      "Aprende técnicas básicas de adiestramiento para mejorar la convivencia con tu mascota.",
  },
];

export default function UpcomingEvents() {
  // Formatear fecha (JS)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {upcomingEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="relative aspect-video">
            {/* Sustituye next/image por img normal */}
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

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
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
  );
}
