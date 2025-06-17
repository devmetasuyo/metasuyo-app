import { useContext } from "react";
import { ModalLoginContext } from "./ModalLoginContext";

export function useModal() {
  const context = useContext(ModalLoginContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
