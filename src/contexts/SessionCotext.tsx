import React, { createContext, useContext, useReducer, ReactNode } from "react";

type SessionState = {
  isAuthenticated: boolean;
  user: null | { id: string; name: string; email: string };
};

type SessionAction =
  | { type: "LOGIN"; payload: { id: string; name: string; email: string } }
  | { type: "LOGOUT" };

const initialState: SessionState = {
  isAuthenticated: false,
  user: null,
};

function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true, user: action.payload };
    case "LOGOUT":
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
}

const SessionContext = createContext<
  | {
      state: SessionState;
      dispatch: React.Dispatch<SessionAction>;
    }
  | undefined
>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
