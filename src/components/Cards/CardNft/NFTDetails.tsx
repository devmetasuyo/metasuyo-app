import React from "react";

import { Nft } from "@/types/nft";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { Input, Select } from "@/components/common";

interface NFTDetailsProps {
  data: Nft;
}

export function NFTDetails({ data }: NFTDetailsProps) {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { collectionNames } = useGetCollectionNames(address);

  const rarityOptions = [
    { value: "1", label: "Ordinario" },
    { value: "2", label: "Común" },
    { value: "3", label: "Raro" },
    { value: "4", label: "Legendario" },
    { value: "5", label: "Mítico" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Input
        disabled={true}
        label="Titulo"
        type="text"
        value={data.name}
        readOnly
      />
      <Select disabled label="Colección" value={data.collectionId} readOnly>
        {collectionNames?.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </Select>
      <Input disabled label="Descripción" value={data.jsonData} readOnly />
      <Select disabled label="Rareza" value={data.rarity} readOnly>
        {rarityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </form>
  );
}
