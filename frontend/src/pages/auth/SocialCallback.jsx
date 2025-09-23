import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (_e) {
    return null;
  }
}

export default function SocialCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      toast({ title: "Error", description: "No se recibió token. Intenta iniciar sesión nuevamente." });
      navigate("/login");
      return;
    }
    localStorage.setItem("authToken", token);

    // Decodificar para persistir un user mínimo (coincide con AuthProvider)
    const decoded = decodeJwt(token);
    if (decoded) {
      const user = {
        name: decoded.name || decoded.nombre || null,
        apellido: decoded.apellido || null,
        email: decoded.email || decoded.correo || null,
        rol: decoded.rol || decoded.role || null,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    toast({ title: "Inicio de sesión exitoso", description: "Has iniciado sesión con tu cuenta social." });
    navigate("/");
  }, [location.search, navigate, toast]);

  return null;
}
