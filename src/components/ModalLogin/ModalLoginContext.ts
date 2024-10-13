import { createContext } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalLoginContext = createContext<ModalContextType | undefined>(
  undefined
);
