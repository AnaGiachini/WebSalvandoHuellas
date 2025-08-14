import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificación de sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulación de login
    const loggedUser = {
      id: "1",
      name: "Usuario",
      email,
      isGuest: false,
    };

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsLoading(false);
  };

  const loginWithSocial = async (provider) => {
    setIsLoading(true);
    // Simulación de login con redes sociales
    const socialUser = {
      id: "2",
      name: `Usuario de ${provider}`,
      email: `usuario_${provider.toLowerCase()}@example.com`,
      isGuest: false,
    };

    localStorage.setItem("user", JSON.stringify(socialUser));
    setUser(socialUser);
    setIsLoading(false);
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    // Simulación de login como invitado
    const guestUser = {
      id: "guest",
      name: "Invitado",
      email: "",
      isGuest: true,
    };

    localStorage.setItem("user", JSON.stringify(guestUser));
    setUser(guestUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithSocial, loginAsGuest, logout, isLoading }}
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
