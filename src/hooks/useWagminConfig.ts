"use client";

import { useMemo, useState, useEffect } from "react";
import { getConfig } from "@/wagmi";
import { cleanupCustomElements, checkCustomElementConflicts } from "@/utils/customElementsCleanup";

export function useWagmiConfig() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        // Verificar y limpiar conflictos antes de crear la configuración
        if (checkCustomElementConflicts()) {
          console.warn("Custom element conflicts detected, cleaning up...");
          cleanupCustomElements();
        }
        
        const wagmiConfig = getConfig();
        setConfig(wagmiConfig);
      } catch (error) {
        console.error("Error creating wagmi config:", error);
        // Intentar limpiar y reintentar una vez
        cleanupCustomElements();
        try {
          const wagmiConfig = getConfig();
          setConfig(wagmiConfig);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          setConfig(null);
        }
      }
    }
  }, [mounted]);

  return config;
}
