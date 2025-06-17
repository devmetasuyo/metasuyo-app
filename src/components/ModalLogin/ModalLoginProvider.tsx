"use client";

import { useState } from "react";
import { ModalLoginContext } from "./ModalLoginContext";

const initialState = {
  isOpen: false,
};

export const ModalLoginProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalLoginContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalLoginContext.Provider>
  );
};
