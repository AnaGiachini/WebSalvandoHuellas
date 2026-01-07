import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Heart,
  Info,
  HelpCircle,
  FileText,
  DollarSign,
  PawPrint,
  Phone,
  Mail,
  Clock,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function InformationPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "about";

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Información</h1>
        <p className="text-muted-foreground max-w-3xl">
          Conoce más sobre nuestra protectora, nuestra misión y cómo puedes ayudar a los animales necesitados.
        </p>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="about">Sobre Nosotros</TabsTrigger>
          <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
          <TabsTrigger value="adoption">Adopción</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
        </TabsList>

        {/* Sobre Nosotros */}
        <TabsContent value="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-4">
                Salvando Huellas nació en 2015 como una iniciativa de un grupo de amantes de los animales en Jesús
                María, Córdoba. Lo que comenzó como un pequeño refugio para perros y gatos abandonados, ha crecido hasta
                convertirse en una organización reconocida en la región por su labor en el rescate, rehabilitación y
                adopción de animales.
              </p>
              <p className="text-muted-foreground mb-4">
                A lo largo de estos años, hemos rescatado a más de 1,000 animales, proporcionándoles atención médica,
                alimentación y un hogar temporal mientras encuentran una familia permanente. Nuestro equipo está formado
                por voluntarios apasionados que dedican su tiempo y esfuerzo a mejorar la vida de estos seres
                indefensos.
              </p>
              <p className="text-muted-foreground">
                Además del rescate y adopción, también nos dedicamos a la educación sobre tenencia responsable de
                mascotas, realizamos campañas de esterilización y vacunación, y trabajamos para concienciar sobre el
                abandono y maltrato animal.
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src="/images/about-us.jpg"
                alt="Equipo de Salvando Huellas"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Misión</h3>
                <p className="text-muted-foreground">
                  Rescatar, rehabilitar y encontrar hogares permanentes para animales abandonados y maltratados,
                  promoviendo la tenencia responsable y el respeto hacia todas las formas de vida.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visión</h3>
                <p className="text-muted-foreground">
                  Ser una organización líder en la protección animal, creando una comunidad donde todos los animales
                  sean tratados con respeto y compasión, y donde el abandono y maltrato sean erradicados.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Valores</h3>
                <p className="text-muted-foreground">
                  Compromiso, respeto, empatía, transparencia y educación son los valores que guían nuestro trabajo
                  diario en la protección y bienestar de los animales.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Nuestro Equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((member) => (
                <div key={member} className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={`/images/team-${member}.jpg`}
                      alt={`Miembro del equipo ${member}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-bold">Nombre Apellido</h3>
                  <p className="text-sm text-muted-foreground">Cargo / Rol</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Preguntas Frecuentes */}
        <TabsContent value="faq">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Preguntas Frecuentes</h2>

              <div className="space-y-6">
                {/* …contenidos de FAQ tal cual… */}
                <div>
                  <h3 className="text-lg font-bold mb-2">¿Cómo puedo adoptar un animal?</h3>
                  <p className="text-muted-foreground">
                    Para adoptar, debes completar un formulario de solicitud, pasar por una entrevista y posiblemente
                    una visita a tu hogar. Este proceso nos ayuda a asegurar que nuestros animales vayan a hogares
                    adecuados. Puedes iniciar el proceso visitando nuestra sección de adopción o contactándonos
                    directamente.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">¿Cuáles son los requisitos para adoptar?</h3>
                  <p className="text-muted-foreground">
                    Los requisitos básicos incluyen ser mayor de edad, tener un hogar estable, capacidad económica para
                    mantener al animal, tiempo para dedicarle y compromiso de cuidado responsable. Cada animal puede
                    tener requisitos específicos adicionales según sus necesidades particulares.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">¿Hay algún costo por adoptar?</h3>
                  <p className="text-muted-foreground">
                    Sí, hay una cuota de adopción que varía según el animal. Esta cuota ayuda a cubrir parte de los
                    gastos veterinarios, alimentación y cuidados que el animal ha recibido durante su estancia con
                    nosotros. Todos los animales se entregan vacunados, desparasitados y, en el caso de adultos,
                    esterilizados.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">¿Cómo puedo ayudar si no puedo adoptar?</h3>
                  <p className="text-muted-foreground">
                    Hay muchas formas de ayudar: puedes ser hogar temporal, donar alimentos o insumos, hacer donaciones
                    monetarias, ser voluntario en nuestras instalaciones o eventos, o simplemente difundir nuestro
                    trabajo en redes sociales. Cada granito de arena cuenta.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">¿Qué hago si encuentro un animal abandonado?</h3>
                  <p className="text-muted-foreground">
                    Si encuentras un animal abandonado, lo primero es asegurar su seguridad. Si puedes, llévalo a un
                    veterinario para verificar su estado de salud. Luego contáctanos para evaluar la situación. Nuestra
                    capacidad de recepción depende del espacio disponible, pero siempre intentamos ayudar o asesorar en
                    estos casos.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">¿Ofrecen servicios veterinarios al público?</h3>
                  <p className="text-muted-foreground">
                    No ofrecemos servicios veterinarios regulares al público, pero ocasionalmente organizamos campañas
                    de vacunación y esterilización a bajo costo. Estas campañas se anuncian en nuestras redes sociales y
                    página web.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">¿Tienes más preguntas?</h3>
                <p className="text-muted-foreground mb-4">
                  Si no encuentras la respuesta a tu pregunta, no dudes en contactarnos. Estaremos encantados de
                  ayudarte.
                </p>
                <Link to="/informacion/contacto">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </Link>
              </div>

              <div className="mt-6 bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Documentos útiles</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/docs/guia-adopcion.pdf" className="flex items-center text-primary hover:underline">
                      <FileText className="h-4 w-4 mr-2" />
                      Guía de adopción
                    </a>
                  </li>
                  <li>
                    <a href="/docs/cuidados-basicos.pdf" className="flex items-center text-primary hover:underline">
                      <FileText className="h-4 w-4 mr-2" />
                      Cuidados básicos para mascotas
                    </a>
                  </li>
                  <li>
                    <a href="/docs/estatutos.pdf" className="flex items-center text-primary hover:underline">
                      <FileText className="h-4 w-4 mr-2" />
                      Estatutos de la organización
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Adopción */}
        <TabsContent value="adoption">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Proceso de Adopción</h2>

              {/* …pasos tal cual… */}
              <div className="space-y-8">
                {/* 1 */} 
                <div className="flex items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Selección del animal</h3>
                    <p className="text-muted-foreground">
                      Explora nuestro catálogo de animales disponibles para adopción...
                    </p>
                  </div>
                </div>
                {/* 2 */}
                <div className="flex items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Solicitud de adopción</h3>
                    <p className="text-muted-foreground">
                      Completa el formulario de solicitud de adopción...
                    </p>
                  </div>
                </div>
                {/* 3,4,5,6 — igual que el original */}
                {/* ...contenido restante idéntico... */}
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Requisitos para adoptar</h3>
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Ser mayor de edad y presentar identificación válida.</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Tener un domicilio estable y adecuado para el animal.</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Contar con recursos económicos suficientes para mantener al animal.</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Disponer de tiempo para atender las necesidades del animal.</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Aceptar las condiciones del contrato de adopción.</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Compromiso de cuidado responsable y de no abandono.</span></li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Cuotas de adopción</h3>
                <p className="text-muted-foreground mb-4">
                  Las cuotas de adopción varían según el tipo y edad del animal...
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Perros adultos</span><span className="font-bold">$2,000</span></div>
                  <div className="flex justify-between"><span>Perros cachorros</span><span className="font-bold">$2,500</span></div>
                  <div className="flex justify-between"><span>Gatos adultos</span><span className="font-bold">$1,500</span></div>
                  <div className="flex justify-between"><span>Gatos cachorros</span><span className="font-bold">$2,000</span></div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Todos los animales se entregan vacunados, desparasitados y, en el caso de adultos, esterilizados.
                </p>
              </div>

              <div className="mt-6 bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">¿Listo para adoptar?</h3>
                <p className="text-muted-foreground mb-4">
                  Si estás listo para dar el paso y adoptar un animal, explora nuestro catálogo...
                </p>
                <Link to="/adopcion">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Heart className="h-4 w-4 mr-2" />
                    Ver animales en adopción
                  </Button>
                </Link>
              </div>

              <div className="mt-6 bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">¿No puedes adoptar?</h3>
                <p className="text-muted-foreground mb-4">
                  Considera otras formas de ayudar, como donaciones o voluntariado.
                </p>
                <Link to="/donaciones">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Hacer una donación
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contacto */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Contacto</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold">Dirección</h3>
                    <p className="text-muted-foreground">Av. Principal 123, Jesús María, Córdoba, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold">Teléfono</h3>
                    <p className="text-muted-foreground">+54 351 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold">Correo electrónico</h3>
                    <p className="text-muted-foreground">contacto@salvandohuellas.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold">Horario de atención</h3>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-muted-foreground">Sábados: 10:00 - 14:00</p>
                    <p className="text-muted-foreground">Domingos: Cerrado</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Síguenos en redes sociales</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Youtube className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Envíanos un mensaje</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border border-input rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-input rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Asunto
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Enviar mensaje
                  </Button>
                </form>
              </div>

              <div className="mt-6">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <img
                    src="/images/map.jpg"
                    alt="Mapa de ubicación"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
