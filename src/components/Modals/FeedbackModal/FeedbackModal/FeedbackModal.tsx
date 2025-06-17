"use client";

import styles from "./FeedBackModal.module.scss";
import { Button, Card, CardContent, Modal, Text } from "@/components/common";
import { useFeedbackModal } from "./useFeedbackModal";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import clsx from "clsx";

interface FeedbackModalProps {}

export function FeedbackModal({}: FeedbackModalProps) {
  const { state, closeModal } = useFeedbackModal();

  const IconComponent =
    state.type === "danger" || state.type === "warning"
      ? FaExclamationTriangle
      : FaCheckCircle;
  return (
    <Modal
      isOpen={state.isOpen}
      handleModal={(isOpen) => {
        if (!isOpen) closeModal();
      }}
    >
      <Card className={styles.feedbackModal} backgroundColor="gray">
        <IconComponent className={clsx([styles.icon, styles[state.type]])} />
        <Text as="h2" variant={state.type}>
          {state.title}
        </Text>
        <CardContent>
          <Text>{state.message}</Text>
          {state.content && state.content}
          <div className={styles.buttons}>
            {state.cancelButton && (
              <Button color="danger" onClick={() => closeModal()}>
                {state.cancelButton ?? "Cancelar"}
              </Button>
            )}
            {state.onConfirm && (
              <Button
                color="success"
                onClick={() => {
                  state.onConfirm && state.onConfirm(true);
                  closeModal();
                }}
              >
                {state.confirmButton ?? "Continuar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
