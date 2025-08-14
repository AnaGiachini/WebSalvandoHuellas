import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useToast } from "../hooks/useToast";
import { useMobile } from "../hooks/useMobile";
import { useAuth } from "../components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdownMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminLogin = () => {
    toast({
      title: "Acceso administrativo",
      description: "Redirigiendo al panel de administración...",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Salvando Huellas</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Link to="/carrito">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link to="/adopcion" className="text-sm font-medium transition-colors hover:text-primary">
              Adopción
            </Link>
            <Link to="/tienda" className="text-sm font-medium transition-colors hover:text-primary">
              Tienda
            </Link>
            <Link to="/eventos" className="text-sm font-medium transition-colors hover:text-primary">
              Eventos
            </Link>
            <Link to="/informacion" className="text-sm font-medium transition-colors hover:text-primary">
              Información
            </Link>
            <Link to="/carrito">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.isGuest ? "Invitado" : user.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/perfil" className="flex w-full">
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/mis-pedidos" className="flex w-full">
                      Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  {!user.isGuest && (
                    <DropdownMenuItem>
                      <Link to="/favoritos" className="flex w-full">
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!user.isGuest && (
                    <DropdownMenuItem onClick={handleAdminLogin}>
                      Panel de administración
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container py-4 bg-background border-b">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link to="/adopcion" className="text-sm font-medium transition-colors hover:text-primary">
              Adopción
            </Link>
            <Link to="/tienda" className="text-sm font-medium transition-colors hover:text-primary">
              Tienda
            </Link>
            <Link to="/eventos" className="text-sm font-medium transition-colors hover:text-primary">
              Eventos
            </Link>
            <Link to="/informacion" className="text-sm font-medium transition-colors hover:text-primary">
              Información
            </Link>

            {user ? (
              <>
                <div className="text-sm font-medium pt-2 border-t">
                  {user.isGuest ? "Sesión de invitado" : `Hola, ${user.name}`}
                </div>
                <Link to="/perfil" className="text-sm font-medium transition-colors hover:text-primary">
                  Mi perfil
                </Link>
                <Link to="/mis-pedidos" className="text-sm font-medium transition-colors hover:text-primary">
                  Mis pedidos
                </Link>
                {!user.isGuest && (
                  <Link to="/favoritos" className="text-sm font-medium transition-colors hover:text-primary">
                    Favoritos
                  </Link>
                )}
                {!user.isGuest && (
                  <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={handleAdminLogin}
                  >
                    Panel de administración
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                <LogIn className="h-4 w-4 mr-2 inline-block" />
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
