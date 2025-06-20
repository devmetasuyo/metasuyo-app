"use client";

import { useEffect } from 'react';
import { usePrivySession } from "@/hooks/usePrivySession";

export function SessionHandler() {
  const { session, loading } = usePrivySession();

  useEffect(() => {
    // Aquí puedes manejar la lógica de sesión si es necesario
    // Por ejemplo, sincronizar con localStorage, etc.
  }, [session]);

  // Este componente no renderiza nada visible
  return null;
} 