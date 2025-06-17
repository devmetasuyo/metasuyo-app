"use client";

import { useMemo } from "react";
import { getConfig } from "@/wagmi";

export function useWagmiConfig() {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    return getConfig();
  }, []);
}
