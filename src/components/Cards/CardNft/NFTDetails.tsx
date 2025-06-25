import React, { useState, useEffect } from "react";

import { Nft } from "@/types/nft";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { Input, Select } from "@/components/common";

interface NFTDetailsProps {
  data: Nft;
}

interface NFTMetadata {
  description?: string;
  name?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: any }>;
}

export function NFTDetails({ data }: NFTDetailsProps) {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { collectionNames } = useGetCollectionNames(address);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!data.jsonData) return;
      
      setIsLoadingMetadata(true);
      try {
        // Construir la URL completa para IPFS
        const metadataUrl = `https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/${data.jsonData}`;
        const response = await fetch(metadataUrl);
        if (response.ok) {
          const metadataJson = await response.json();
          setMetadata(metadataJson);
        }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [data.jsonData]);

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
      
      {/* Campo de descripción mejorado */}
      <div style={{ marginBottom: "1rem" }}>
        <label 
          style={{ 
            color: "#ffffff", 
            display: "block", 
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}
        >
          Descripción del NFT
        </label>
        <div 
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            color: "#ffffff",
            fontSize: "0.9rem",
            lineHeight: "1.5",
            minHeight: "60px",
            wordWrap: "break-word"
          }}
        >
          {isLoadingMetadata ? (
            <span style={{ color: "#cccccc", fontStyle: "italic" }}>
              Cargando descripción...
            </span>
          ) : metadata?.description ? (
            metadata.description
          ) : (
            <span style={{ color: "#cccccc", fontStyle: "italic" }}>
              No hay descripción disponible
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label 
          style={{ 
            color: "#ffffff", 
            display: "block", 
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}
        >
          Duplicados disponibles: {data.duplicates}
        </label>
      </div>
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
