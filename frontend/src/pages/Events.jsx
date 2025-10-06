import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEvents } from "../services/eventsService";
import Loading from "../components/ui/Loading";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getEvents();
        // Mapear campos del backend → frontend
        const mapped = (list || []).map((e) => ({
          id: e.idEvento,
          title: e.titulo,
          date: e.fecha,
          time: "",
          location: e.lugar,
          image: e.foto,
          description: e.descripcion,
        }));
        setEvents(mapped);
      } catch (err) {
        setError("No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Separar eventos próximos y pasados (comparación por día)
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const upcoming = events.filter((event) => new Date(event.date) >= todayMidnight);
    const past = events.filter((event) => new Date(event.date) < todayMidnight);
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <div className="container py-8 md:py-12">
      {loading && <Loading />}
      {!!error && (
        <p className="mb-4 text-sm text-red-500" role="alert">{error}</p>
      )}
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
                  {event.time ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {event.time}
                    </div>
                  ) : null}
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
                  {event.time ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {event.time}
                    </div>
                  ) : null}
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
