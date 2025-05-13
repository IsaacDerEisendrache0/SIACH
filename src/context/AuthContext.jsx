// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { auth } from "../firebaseConfigc"; // Ajusta la ruta si es necesario
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Función para manejar el cierre de sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Limpiar el estado del usuario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Aquí se puede agregar una lógica para escuchar cambios en la autenticación
  // y actualizar el estado del usuario

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
