"use client";

import styles from "./styles.module.scss";
import { Modal } from "@/components/Common";
import { useFeedbackModal } from "./useFeedbackModal";

interface FeedbackModalProps {}

export function FeedbackModal({}: FeedbackModalProps) {
  const { state, closeModal } = useFeedbackModal();

  return (
    <Modal
      isOpen={state.isOpen}
      handleModal={(isOpen) => {
        if (!isOpen) closeModal();
      }}
    >
      <div
        className={`${styles.feedbackModal} ${state.isError ? styles.error : styles.success}`}
      >
        <h2>{state.isError ? "¡Error!" : "¡Operación exitosa!"}</h2>
        <p>{state.message}</p>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </Modal>
  );
}
