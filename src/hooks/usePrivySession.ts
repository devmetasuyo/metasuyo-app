"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { UserSession } from "@/components/types/user";

export function usePrivySession() {
  const { authenticated, user, login: privyLogin, logout: privyLogout} = usePrivy();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Llama al backend para setear la cookie cuando el usuario está autenticado
  const syncSession = useCallback(async () => {
    if (authenticated && user?.wallet?.address) {
      setLoading(true);
      setError(null);
      try {
        // Login al backend para setear la cookie
        await axios.post("/api/auth/login", { wallet: user.wallet.address });
        // Ahora sí, fetch de la sesión
        const { data } = await axios.get("/api/auth/session");
        setSession(data.user || null);
      } catch (err: any) {
        setError("No se pudo sincronizar la sesión");
        setSession(null);
      } finally {
        setLoading(false);
      }
    } else {
      setSession(null);
    }
  }, [authenticated, user]);

  // Sincroniza la sesión cada vez que cambia el estado de Privy
  useEffect(() => {
    syncSession();
  }, [syncSession]);

  // Función para login (llama primero a Privy)
  const login = useCallback(async () => {
    await privyLogin();
    // El useEffect se encargará de sincronizar la sesión
  }, [privyLogin]);

  // Función para logout (llama a Privy y limpia la sesión)
  const logout = useCallback(async () => {
    await privyLogout();
    setSession(null);
  }, [privyLogout]);

  return {
    session,
    loading,
    error,
    login,
    logout,
    authenticated,
    user,
  };
}
