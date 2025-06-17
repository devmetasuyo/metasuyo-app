"use client";

import { getEthPrice } from "@/utils/getEthPrice";
import { useEffect } from "react";
import { useAccountEffect } from "wagmi";
import { usePrivySession } from "@/hooks/usePrivySession";

interface Props extends React.PropsWithChildren {}

export function Wrapper({ children }: Props) {
  const { session, logout } = usePrivySession();

  useAccountEffect({
    onDisconnect: async () => {
      if (session) logout();
    },
  });

  useEffect(() => {
    async function updatePrice() {
      const lastUpdate = localStorage.getItem("priceLastUpdate");

      if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastUpdateDate.getTime());

        if (diffTime < 300000) {
          return;
        }
      }

      const response = await getEthPrice();

      if (!response) return;

      localStorage.setItem("price", response.price);
      localStorage.setItem("priceLastUpdate", response.priceLastUpdate);
    }
    updatePrice();
  }, []);

  return <>{children}</>;
}
