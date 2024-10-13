"use client";

import "./styles.scss";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Address, getAddress } from "viem";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useAccount } from "wagmi";
import { useBasename } from "@/hooks/useBasename";
import { UserDropdown } from "@/components/Dropdowns";

const links = [
  { href: "", label: "Inicio" },
  { href: "Market", label: "Colecciones" },
];

const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export function Header() {
  const { address, chainId, isConnecting } = useAccount();
  const { data } = useBasename(address as Address);
  const [isOpen, setIsOpen] = useState(false);
  const [menuState, setMenuState] = useState("");
  const menuRef = useRef<HTMLUListElement>(null);

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

  return (
    <header>
      <nav>
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
        <button
          className="menu-icon"
          onClick={(e) => {
            e.stopPropagation();
            setMenuState(isOpen ? "close" : "open");
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <></> : <FiMenu color="#fff" />}
        </button>
        {isConnecting ? (
          <div>Conectado a la red...</div>
        ) : (
          <ul className={`menu ${menuState}`} ref={menuRef}>
            <li>
              <button
                className="menu-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuState(isOpen ? "close" : "open");
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? <MdClose /> : <MdClose />}
              </button>
            </li>

            {address && (
              <>
                {links.map(({ href, label }) => (
                  <li key={`${href}-${label}`}>
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      href={`/${href}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li key="perfil">
                  <Link href={`/Perfil/${address}`}>Perfil</Link>
                </li>
              </>
            )}

            {address === adminWallet && (
              <li>
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  href={`/Dashboard`}
                >
                  Dashboard
                </Link>
              </li>
            )}

            <li>
              <UserDropdown
                avatar={data?.avatar}
                account={data?.basename ?? address}
                chainId={chainId?.toString() ?? ""}
                onConnect={() => {}}
                onSwitchChain={() => {}}
              />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
