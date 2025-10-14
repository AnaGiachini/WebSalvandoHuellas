import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../hooks/useToast";
import { useMobile } from "../hooks/useMobile";
import { useAuth } from "../components/auth/AuthProvider";
import cartService from "../services/cartService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdownMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const isMobile = useMobile();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function onDocumentClick(e) {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(e.target)) return;
      setUserMenuOpen(false);
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", onDocumentClick);
      document.addEventListener("touchstart", onDocumentClick);
    }
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("touchstart", onDocumentClick);
    };
  }, [userMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const handleAdminLogin = () => {
    toast({
      title: "Acceso administrativo",
      description: "Redirigiendo al panel de administración...",
    });
    setUserMenuOpen(false);
    navigate("/admin");
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/");
    // En algunos navegadores, forzar un re-render completo ayuda a limpiar UI en cache
    setTimeout(() => window.location.reload(), 0);
  };

  // Cargar y mantener actualizado el contador del carrito
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
        if (!user || !hasToken) { if (mounted) setCartCount(0); return; }
        const cart = await cartService.getMyCart();
        if (!mounted) return;
        const count = Array.isArray(cart?.items) ? cart.items.reduce((sum, it) => sum + (it.cantidad || 0), 0) : 0;
        setCartCount(count);
      } catch {
        if (mounted) setCartCount(0);
      }
    };
    refresh();
    const onUpdated = () => refresh();
    window.addEventListener('cart:updated', onUpdated);
    return () => { mounted = false; window.removeEventListener('cart:updated', onUpdated); };
  }, [user]);

  const displayName = user
    ? user.name || [user.nombre, user.apellido].filter(Boolean).join(" ") || "Usuario"
    : null;

  const isAdmin = user?.rol === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Salvando Huellas</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Link to="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-[10px] leading-4 text-white text-center">
                    {cartCount}
                  </span>
                )}
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
                <div ref={userMenuRef} className="relative">
                  <DropdownMenuTrigger onClick={toggleUserMenu}>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  {userMenuOpen && (
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user.isGuest ? "Invitado" : displayName}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}>
                        Mi perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setUserMenuOpen(false); navigate("/mis-solicitudes"); }}>
                        Mis solicitudes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setUserMenuOpen(false); navigate("/mis-pedidos"); }}>
                        Mis pedidos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setUserMenuOpen(false); navigate("/mis-donaciones"); }}>
                        Mis donaciones
                      </DropdownMenuItem>
                      {!user.isGuest && (
                        <DropdownMenuItem onClick={() => { setUserMenuOpen(false); navigate("/favoritos"); }}>
                          Favoritos
                        </DropdownMenuItem>
                      )}
                      {isAdmin && (
                        <DropdownMenuItem onClick={handleAdminLogin}>
                          Panel de administración
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar sesión
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </div>
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
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link to="/adopcion" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Adopción
            </Link>
            <Link to="/tienda" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Tienda
            </Link>
            <Link to="/eventos" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Eventos
            </Link>
            <Link to="/informacion" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Información
            </Link>

            {user ? (
              <>
                <div className="text-sm font-medium pt-2 border-t">
                  {user.isGuest ? "Sesión de invitado" : `Hola, ${displayName}`}
                </div>
                <Link to="/perfil" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Mi perfil
                </Link>
                <Link to="/mis-solicitudes" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Mis solicitudes
                </Link>
                <Link to="/mis-pedidos" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Mis pedidos
                </Link>
                <Link to="/mis-donaciones" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Mis donaciones
                </Link>
                {!user.isGuest && (
                  <Link to="/favoritos" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                    Favoritos
                  </Link>
                )}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() => { setIsMenuOpen(false); handleAdminLogin(); }}
                  >
                    Panel de administración
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
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
