import { fetchData } from "@/utils/FetchBasenames";
import { useEffect, useState } from "react";
import { Address } from "viem";

export const useBasename = (address: Address) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (address) {
      fetchData(address).then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [address]);

  return { data, loading };
};
