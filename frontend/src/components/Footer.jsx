import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-foreground border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-primary mb-2">Salvando Huellas</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Protectora de animales en Jesús María, Córdoba
            </p>
          </div>

          <div>
            <h4 className="font-medium text-base mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/adopcion" className="text-muted-foreground hover:text-primary transition-colors">
                  Adopción
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-muted-foreground hover:text-primary transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-muted-foreground hover:text-primary transition-colors">
                  Eventos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-base mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Jesús María, Córdoba</li>
              <li>
                <a
                  href="mailto:salvandohuellasjesusmaria@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  salvandohuellasjesusmaria@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/543525418986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp: +54 3525 418986
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-base mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100079609239145"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/salvandohuellas01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://x.com/Salvand0Huellas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
            <div className="mt-4 flex justify-end">
              <img
                src="/images/hero-image.jpg"
                alt="Mascotas Salvando Huellas"
                className="h-16 w-24 md:h-20 md:w-32 object-cover shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Salvando Huellas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
