"use client";

import React, { createContext, useReducer, useCallback } from "react";
import { FeedbackModalContextType, FeedbackModalState } from "./types";
import {
  feedbackModalInitialState,
  feedbackModalReducer,
} from "./FeedBackModalReducer";

export const FeedbackModalContext = createContext<
  FeedbackModalContextType | undefined
>(undefined);

export const FeedbackModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    feedbackModalReducer,
    feedbackModalInitialState
  );

  const openModal = useCallback(
    (params: Omit<FeedbackModalState, "isOpen">) =>
      dispatch({ type: "OPEN", payload: { ...params } }),
    []
  );

  const closeModal = useCallback(() => dispatch({ type: "CLOSE" }), []);

  const updateModal = useCallback(
    (params: Partial<FeedbackModalState>) =>
      dispatch({ type: "UPDATE", payload: params }),
    []
  );

  return (
    <FeedbackModalContext.Provider
      value={{ state, openModal, closeModal, updateModal }}
    >
      {children}
    </FeedbackModalContext.Provider>
  );
};
