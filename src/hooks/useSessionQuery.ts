"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  documento: string | null;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  tipo_documento: string;
  creado_el: Date | null;
  actualizado_el: Date | null;
  wallet: string | null;
};

const fetchSession = async (): Promise<User | null> => {
  try {
    const { data } = await axios.get("/api/auth/session");
    return data.user || null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

const login = async (wallet: string): Promise<User> => {
  const { data } = await axios.post("/api/auth/login", { wallet });
  return data.user;
};

const logout = async (): Promise<void> => {
  await axios.get("/api/auth/logout");
};

export function useSessionQuery() {
  const router = useRouter();

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await sessionQuery.refetch();
      router.refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await sessionQuery.refetch();
      router.refresh();
    },
  });

  return {
    session: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isError: sessionQuery.isError,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refetch: sessionQuery.refetch,
  };
}
