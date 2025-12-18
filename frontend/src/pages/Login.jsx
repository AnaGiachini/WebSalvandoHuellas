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

import { Link } from "react-router-dom";
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
