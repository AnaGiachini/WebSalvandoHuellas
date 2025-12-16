import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../../services/authService";

const AuthContext = createContext(undefined);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (_e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          // No hay /auth/me en backend → intentamos decodificar el JWT
          const decoded = decodeJwt(token);
          if (decoded) {
            const resolvedUser = {
              // toleramos distintos nombres de claims
              name: decoded.name || decoded.nombre || null,
              apellido: decoded.apellido || null,
              email: decoded.email || decoded.correo || null,
              rol: decoded.rol || decoded.role || null,
            };
            localStorage.setItem("user", JSON.stringify(resolvedUser));
            setUser(resolvedUser);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      const token = data?.token || data?.data?.token;
      if (token) localStorage.setItem("authToken", token);

      // Backend no devuelve user; intentamos decodificar el token
      let resolvedUser = null;
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded) {
          resolvedUser = {
            name: decoded.name || decoded.nombre || null,
            apellido: decoded.apellido || null,
            email: decoded.email || decoded.correo || email,
            rol: decoded.rol || decoded.role || null,
          };
        }
      }
      // Fallback mínimo: guardar email para reflejar sesión
      if (!resolvedUser) {
        resolvedUser = { email };
      }

      localStorage.setItem("user", JSON.stringify(resolvedUser));
      setUser(resolvedUser);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * UC01: Registrar usuario (capa de contexto)
   * --------------------------------------------------------------------------
   * - Llama a authService.register para crear el usuario en el backend
   * - Almacena el token JWT en localStorage
   * - Usa los datos de usuario devueltos por el backend (si existen) o,
   *   en su defecto, los del formulario como representación mínima.
   */
  const register = async (payload) => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);
      const token = data?.token || data?.data?.token;
      if (token) localStorage.setItem("authToken", token);

      // Si el backend devuelve datos de usuario, los usamos como fuente de verdad
      const backendUser = data?.user || data?.data?.user;
      const resolvedUser = backendUser
        ? {
            idUsuario: backendUser.idUsuario,
            name: backendUser.nombre,
            apellido: backendUser.apellido,
            email: backendUser.email,
            rol: backendUser.rol,
          }
        : {
            // Fallback mínimo: usar los datos del formulario
            name: payload.name ?? payload.nombre,
            apellido: payload.lastName ?? payload.apellido,
            email: payload.email,
          };
      localStorage.setItem("user", JSON.stringify(resolvedUser));
      setUser(resolvedUser);

      return data;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
