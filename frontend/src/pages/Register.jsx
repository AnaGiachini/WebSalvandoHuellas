import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import SocialLogin from "../components/auth/SocialLogin";

export default function RegisterPage() {
  return (
    <div className="container py-12 md:py-24 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Regístrate para acceder a todas las funcionalidades de Salvando
              Huellas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Ingresa tu nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea una contraseña segura"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirma tu contraseña"
              />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los{" "}
                <Link
                  href="/terminos"
                  className="text-primary hover:underline"
                >
                  términos y condiciones
                </Link>
              </label>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Crear cuenta
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O regístrate con
                </span>
              </div>
            </div>

            <SocialLogin />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
