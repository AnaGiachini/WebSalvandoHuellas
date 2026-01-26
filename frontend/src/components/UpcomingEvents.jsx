// /frontend/src/components/UpcomingEvents.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEvents } from "../services/eventsService";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formatear fecha (JS)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        const list = Array.isArray(data) ? data : data?.data || [];

        // Filtramos próximos eventos (fecha >= hoy)
        const now = new Date();
        const upcoming = list
          .filter((e) => {
            const d = e.fecha ? new Date(e.fecha) : null;
            return d && d >= now;
          })
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        // Mostramos máximo 3 en Home
        setEvents(upcoming.slice(0, 3));
        setError("");
      } catch (e) {
        console.error("Error cargando eventos", e);
        setError("No pudimos cargar los próximos eventos.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Cargando próximos eventos...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-8 text-center text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!events.length) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Por el momento no hay eventos próximos publicados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {events.map((event) => (
        <Card key={event.idEvento} className="overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={event.imagen || "/placeholder.svg"}
              alt={event.titulo}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <CardContent className="p-4">
            <h3 className="text-xl font-bold">{event.titulo}</h3>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {event.fecha ? formatDate(event.fecha) : "Fecha a confirmar"}
              </div>

              {event.hora && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  {event.hora}
                </div>
              )}

              {event.lugar && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {event.lugar}
                </div>
              )}
            </div>

            {event.descripcion && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {event.descripcion}
              </p>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Link to={`/eventos/${event.idEvento}`} className="w-full">
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
