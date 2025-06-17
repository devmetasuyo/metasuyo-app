"use client";

import styles from "./styles.module.scss";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { usePrivySession } from "@/hooks/usePrivySession";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  handleModal: (state: boolean) => void;
}

export function Modal({ handleModal, isOpen, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { session } = usePrivySession();

  function closeModal() {
    handleModal(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open && !isClosing) {
      closeModalWithAnimation();
    }
  }, [isOpen, isClosing]);

  const closeModalWithAnimation = async () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || isClosing) return;

    setIsClosing(true);
    dialog.setAttribute("closing", "");

    const handleAnimationEnd = () => {
      dialog.removeAttribute("closing");
      dialog.close();
      setIsClosing(false);
    };

    dialog.addEventListener("animationend", handleAnimationEnd, { once: true });
  };

  const handleClose = () => {
    if (!isClosing) {
      closeModal();
    }
  };

  const onConfirm = (confirm: boolean) => {
    if (confirm && session?.wallet) {
      window.location.href = `/Perfil/${session.wallet}?showModal=true`;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      {children}
    </dialog>
  );
}
