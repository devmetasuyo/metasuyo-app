import { FeedbackModalAction, FeedbackModalState } from "./types";
export const feedbackModalInitialState: FeedbackModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "success",
};

export const feedbackModalReducer = (
  state: FeedbackModalState,
  actions: FeedbackModalAction
): FeedbackModalState => {
  switch (actions.type) {
    case "OPEN":
      return {
        ...state,
        ...actions.payload,
        isOpen: true,
      };
    case "CLOSE":
      return {
        ...state,
        isOpen: false,
      };
    case "UPDATE":
      return {
        ...state,
        ...actions.payload,
      };
  }
};
