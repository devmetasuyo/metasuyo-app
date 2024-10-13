import { CardImage } from "@/components/Common/Card/CardImage";
import React from "react";

export function NFTCardImage({
  imageUri,
  name,
}: {
  imageUri: string;
  name: string;
}) {
  return (
    <CardImage imageUri={imageUri} alt={name} height={1080} width={1080} />
  );
}
