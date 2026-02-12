import { useState } from "react";
import { Button } from "../ui/button"; // Ajusta la ruta según tu estructura
import { useToast } from "../../hooks/useToast"; // Ajusta la ruta
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // React Router para navegación

export default function GuestLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Reemplazo de useRouter
  const { toast } = useToast();

  const handleGuestLogin = () => {
    setIsLoading(true);

    // Simulación de inicio de sesión como invitado
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Acceso como invitado",
        description:
          "Has ingresado como invitado. Algunas funciones pueden estar limitadas.",
      });
      let redirectTo = "/";
      try {
        const storedFrom = localStorage.getItem("postLoginRedirect");
        if (storedFrom) {
          redirectTo = storedFrom;
        }
      } catch (_e) {}

      if (redirectTo === "/login" || redirectTo === "/register") {
        redirectTo = "/";
      }

      navigate(redirectTo); // Reemplazo de router.push("/")
    }, 1000);
  };

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={handleGuestLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        "Cargando..."
      ) : (
        <>
          <User className="h-5 w-5 mr-2" />
          Continuar como invitado
        </>
      )}
    </Button>
  );
}
