import React from "react";

export type typeModal = "warning" | "danger" | "success";

export type FeedbackModalState = {
  isOpen: boolean;
  type: typeModal;
  title: string;
  message?: string;
  content?: React.ReactElement;
  confirmButton?: string;
  cancelButton?: string;
  onConfirm?: (confirm: boolean) => Promise<void> | void;
  onCancel?: (confirm: boolean) => Promise<void> | void;
};

export type FeedbackModalAction =
  | {
      type: "OPEN";
      payload: Omit<FeedbackModalState, "isOpen">;
    }
  | {
      type: "CLOSE";
    }
  | {
      type: "UPDATE";
      payload: Partial<FeedbackModalState>;
    };

export interface FeedbackModalContextType {
  state: FeedbackModalState;
  openModal: (params: Omit<FeedbackModalState, "isOpen">) => void;
  closeModal: () => void;
  updateModal: (params: Partial<FeedbackModalState>) => void;
}
