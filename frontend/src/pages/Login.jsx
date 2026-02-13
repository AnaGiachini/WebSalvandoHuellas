/**
 * Página: LoginPage
 * --------------------------------------------------------------------------
 * UC02: Inicio de sesión de usuarios.
 *
 *  • Responsabilidades
 *      - Mostrar el formulario de login tradicional (email + contraseña)
 *      - Ofrecer login social (Google/Facebook) y login invitado
 *      - Enlazar con la página de registro para nuevos usuarios
 */
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import LoginForm from "../components/auth/LoginForm";
import GuestLogin from "../components/auth/GuestLogin";
import SocialLogin from "../components/auth/SocialLogin";

export default function LoginPage() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const rawNext = params.get("next");
  const next = rawNext ? decodeURIComponent(rawNext) : null;

  // Si venimos redirigidos con un estado `from`, lo persistimos para flujos de login social
  if (location.state?.from) {
    try {
      localStorage.setItem("postLoginRedirect", location.state.from);
    } catch (_e) {
      // ignore storage errors (p. ej. modo incógnito restringido)
    }
  } else if (next) {
    try {
      localStorage.setItem("postLoginRedirect", next);
    } catch (_e) {
      // ignore storage errors
    }
  } else if (!next) {
    // Acceso directo a /login (por ejemplo desde Home o menú): normalizamos destino a home
    try {
      localStorage.setItem("postLoginRedirect", "/");
    } catch (_e) {
      // ignore storage errors
    }
  }

  const fromState = location.state?.from;
  const showDonationMessage = next === "/donaciones" || fromState === "/donaciones";
  const isStoreFlow =
    (next && (next === "/tienda" || next === "/carrito" || next === "/checkout" || next.startsWith("/tienda"))) ||
    (fromState && (fromState === "/tienda" || fromState === "/carrito" || fromState === "/checkout" || fromState.startsWith("/tienda")));
  return (
    <div className="container py-12 md:py-24 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingresa con tu email y contraseña o utiliza tus redes sociales
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {showDonationMessage && (
              <div className="mb-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800 text-left">
                Para realizar una donación necesitás iniciar sesión o crear una cuenta. Una vez que te identifiques
                te vamos a devolver automáticamente a la página de donaciones.
              </div>
            )}
            {isStoreFlow && !showDonationMessage && (
              <div className="mb-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 text-left">
                Para comprar en la tienda necesitás iniciar sesión o crear una cuenta. Una vez que te identifiques
                te vamos a devolver automáticamente al paso de compra que estabas realizando.
              </div>
            )}
            <LoginForm />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O
                </span>
              </div>
            </div>

            <SocialLogin />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O
                </span>
              </div>
            </div>
            <GuestLogin />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
