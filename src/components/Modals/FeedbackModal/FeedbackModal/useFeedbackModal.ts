import { useContext } from "react";
import { FeedbackModalContext } from "./FeedbackModalContext";

export function useFeedbackModal() {
  const context = useContext(FeedbackModalContext);
  if (context === undefined) {
    throw new Error(
      "useFeedbackModal debe ser usado dentro de un FeedbackModalProvider"
    );
  }
  return context;
}
