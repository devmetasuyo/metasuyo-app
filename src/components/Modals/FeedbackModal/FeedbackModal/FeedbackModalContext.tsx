"use client";

import React, {
  createContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";

type FeedbackModalState = {
  isOpen: boolean;
  message: string;
  isError: boolean;
};

type FeedbackModalAction =
  | { type: "OPEN"; message: string; isError: boolean }
  | { type: "CLOSE" };

type FeedbackModalContextType = {
  state: FeedbackModalState;
  openModal: (message: string, isError: boolean) => void;
  closeModal: () => void;
};

const initialState: FeedbackModalState = {
  isOpen: false,
  message: "",
  isError: false,
};

function feedbackModalReducer(
  state: FeedbackModalState,
  action: FeedbackModalAction
): FeedbackModalState {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        isOpen: true,
        message: action.message,
        isError: action.isError,
      };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export const FeedbackModalContext = createContext<
  FeedbackModalContextType | undefined
>(undefined);

export function FeedbackModalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(feedbackModalReducer, initialState);

  const openModal = useCallback((message: string, isError: boolean) => {
    dispatch({ type: "OPEN", message, isError });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  return (
    <FeedbackModalContext.Provider value={{ state, openModal, closeModal }}>
      {children}
    </FeedbackModalContext.Provider>
  );
}
