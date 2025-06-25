"use client";

import React from "react";
import { Card, CardContent, Spinner } from "@/components";
import { useGetNftData } from "@/hooks/useGetNftData";
import { NFTCardImage, NFTOwnershipActions } from "@/components/Shared";
import { NFTDetails } from "./NFTDetails";
import styles from "./styles.module.scss";

export function CardNft({ id }: { id: number }) {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { data, isLoading } = useGetNftData(contractAddress, +id);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <CardContent>
          <div className={styles.cardContent}>
            <div className={styles.nftContainer}>
              <div className={styles.imageContainer}>
                <NFTCardImage
                  imageUri={data?.imageUri ? data.imageUri : "/icon.png"}
                  name={data?.name ? data.name : "no existe"}
                />
              </div>
              <div className={styles.detailsContainer}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {data && (
                      <>
                        <NFTDetails data={{ ...data }} />
                        <div className={styles.ownershipActions}>
                          <NFTOwnershipActions id={id} data={{ ...data }} />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
