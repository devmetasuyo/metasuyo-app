"use client";
import "./styles.scss";
import { Navbar } from "./Navbar";

const links = [
  { href: "", label: "Inicio" },
  { href: "Shop", label: "Tienda" },
  { href: "Perfil", label: "Perfil" },
  { href: "Market", label: "Colecciones" },
];

export function Header() {
  return (
    <header>
      <Navbar userLinks={links} />
      {/* Aquí puedes agregar banners, etc. */}
    </header>
  );
}
