"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { ButtonSignIn } from "@/components/Buttons/ButtonSigin";
import { usePrivySession } from "@/hooks/usePrivySession";
import { AdminLinks } from "./AdminLinks";
import { UserDropdown } from "@/components/Dropdowns/UserDropDown/UserDropdown";

interface Props extends React.PropsWithChildren {
  userLinks: {
    href: string;
    label: string;
  }[];
}

export function Navbar({ children, userLinks }: Props) {
  const { session, loading } = usePrivySession();
  const [menuState, setMenuState] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLUListElement>(null);

  const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

  const isAdmin = session?.wallet?.toLowerCase() === ADMIN_WALLET;

  const closeMenu = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [isOpen]);

  if (loading) return null;

  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
      <div className="logo-container">
        <Link href={`/`}>
          <Image
            width={50}
            height={50}
            priority
            src="/icon.png"
            className="logo"
            alt="logo"
          />
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <ul className="navbar-links" style={{ display: "flex", alignItems: "center", gap: 16, listStyle: "none", margin: 0, padding: 2 }}>
          {userLinks.map((link) => (
            <li key={link.label}>
              <Link 
                href={`/${link.href}`}
                style={{ color: '#fff', textDecoration: 'none' }}
                onMouseDown={e => e.currentTarget.style.color = '#fff'}
                onMouseUp={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                onFocus={e => e.currentTarget.style.color = '#fff'}
                onBlur={e => e.currentTarget.style.color = '#fff'}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAdmin && (
            <li>
              <AdminLinks />
            </li>
          )}
        </ul>
        {session ? (
          <UserDropdown />
        ) : (
          <ButtonSignIn>Conectar Wallet</ButtonSignIn>
        )}
      </div>
      <button
        className="menu-icon"
        style={{ display: "none" }}
        onClick={(e) => {
          e.stopPropagation();
          setMenuState(isOpen ? "close" : "open");
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <MdClose /> : <FiMenu color="#fff" />}
      </button>
    </nav>
  );
}
