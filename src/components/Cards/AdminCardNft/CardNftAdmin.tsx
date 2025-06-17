"use client";

import React from "react";
import { NFTCardImage, NFTOwnershipActions } from "@/components/Shared";
import { Card, CardContent, Spinner } from "@/components";
import { useGetNftData } from "@/hooks/useGetNftData";
import { NFTDetails } from "./NFTDetails";

export function CardNftAdmin({ id }: { id: number }) {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { data, isLoading } = useGetNftData(contractAddress, +id);

  return (
    <Card style={{ width: "900px", flexDirection: "row" }}>
      <NFTCardImage
        imageUri={data?.imageUri ? data.imageUri : "/icon.png"}
        name={data?.name ? data.name : "no existe"}
      />
      <CardContent style={{ width: "100%", height: "100%" }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {data && (
              <>
                <NFTDetails
                  data={{ ...data }}
                  onSubmit={(data) => {
                    //TODO REVISAR
                  }}
                />
                <NFTOwnershipActions id={id} data={{ ...data }} />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
