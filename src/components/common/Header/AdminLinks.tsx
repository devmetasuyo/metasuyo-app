"use client";

import { usePrivySession } from "@/hooks/usePrivySession";
import Link from "next/link";

export const AdminLinks = () => {
  const { loading } = usePrivySession();
  if (loading) return <></>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Link href={`/Dashboard`} style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
      <Link href={`/Poaps/createxx`} style={{ color: '#fff', textDecoration: 'none' }}>Crear Poaps</Link>
    </div>
  );
};
