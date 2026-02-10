import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { getEventById } from "../services/eventsService";
import Loading from "../components/ui/Loading";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent({
            id: data.idEvento,
            title: data.titulo,
            date: data.fecha,
            location: data.lugar,
            image: data.foto,
            description: data.descripcion,
          });
        }
      } catch (err) {
        setError("No se pudo cargar el evento");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("es-ES", options);
  };

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <Loading />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container py-8 md:py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error || "Evento no encontrado"}</p>
            <Button onClick={() => navigate("/eventos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="container py-8 md:py-12">
      {/* Botón volver */}
      <div className="mb-6">
        <Link to="/eventos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a eventos
          </Button>
        </Link>
      </div>

      {/* Contenido del evento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2">
          <Card className={isPast ? "opacity-75" : ""}>
            <div className="relative aspect-video">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className={`absolute inset-0 h-full w-full object-cover ${isPast ? "grayscale" : ""}`}
                loading="lazy"
              />
              {isPast && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold">
                    Evento Finalizado
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-primary mb-4">{event.title}</h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span className="font-medium">{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span className="font-medium">{event.location || "Ubicación por confirmar"}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-primary mb-3">Descripción</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description || "Sin descripción disponible."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Información del Evento</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <p className={`font-semibold ${isPast ? 'text-gray-600' : 'text-green-600'}`}>
                    {isPast ? "Finalizado" : "Próximo"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                  <p className="font-semibold">{formatDate(event.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hora</p>
                  <p className="font-semibold">{formatTime(event.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                  <p className="font-semibold">{event.location || "Por confirmar"}</p>
                </div>
              </div>

              {!isPast && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold mb-3">¿Quieres participar?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contáctanos para más información sobre este evento.
                  </p>
                  <Link to="/informacion?tab=contact">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Contactar
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Otros eventos */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="text-sm font-semibold mb-3">Más eventos</h4>
              <Link to="/eventos">
                <Button variant="outline" className="w-full">
                  Ver todos los eventos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
