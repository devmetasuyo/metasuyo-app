"use client";

import { LoginForm } from "../LoginForm/LoginForm";
import styles from "./styles.module.scss";
import { useModal } from "./useModalLogin";
import { useEffect, useRef, useState } from "react";

export function ModalLogin() {
  const { isOpen, closeModal } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        x
      </button>
      <div className={styles.modalContent}>
        <h2 className={styles.modalContentTitle}>Iniciar sesión</h2>
        <LoginForm onLogin={async (email) => {}} />
      </div>
    </dialog>
  );
}
