import { useState, useEffect } from "react";
import { truncateString } from "@/utils/stringUtils";
import {
  Alert,
  Spinner,
  Button,
  Input,
  Select,
  Modal,
  Card,
  CardHeader,
  CardContent,
} from "../common";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nftSchema, NftFormData } from "./validation";
import { useCreateNFT } from "@/hooks/useCreateNFT";
import { uploadImageToPinata, uploadMetadataToPinata } from "@/utils/nftUpload";

import styles from "./styles.module.scss";
import { NftMintCard } from "../Cards";

type AlertType = "error" | "success" | "info" | null;

interface AlertState {
  type: AlertType;
  message: string;
}

const addressWallet = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface NFTFormProps {
  collections: any[];
  userAddress: `0x${string}` | undefined;
}

export default function NFTForm({ collections, userAddress }: NFTFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [createdNFT, setCreatedNFT] = useState<{
    name: string;
    rarity: number;
    imageUri: string;
  } | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NftFormData>({
    resolver: zodResolver(nftSchema),
  });

  const {
    executeCreateNFT,
    isTransactionLoading,
    isTransactionSuccess,
    isWritePending,
    transactionError,
    writeError,
  } = useCreateNFT(addressWallet);

  useEffect(() => {
    if (isTransactionSuccess) {
      setAlert({
        type: "success",
        message: "¡El NFT se ha creado correctamente!",
      });
      setFormSubmitted(true);
      setModalOpen(true);
      reset();
    } else if (transactionError) {
      setAlert({
        type: "error",
        message: `Error en la transacción: ${truncateString(transactionError.message, 100)}`,
      });
    } else if (writeError) {
      setAlert({
        type: "error",
        message: `Error al escribir en el contrato: ${truncateString(writeError.message, 100)}`,
      });
    }
  }, [isTransactionSuccess, transactionError, writeError, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const rarityOptions = [
    { value: "1", label: "Ordinario" },
    { value: "2", label: "Común" },
    { value: "3", label: "Raro" },
    { value: "4", label: "Legendario" },
    { value: "5", label: "Mítico" },
  ];

  const onSubmit = async (data: NftFormData) => {
    setFormSubmitted(false);
    setAlert({ type: null, message: "" });
    try {
      const imageHash = await uploadImageToPinata(data.image[0], data.title);
      const metadataHash = await uploadMetadataToPinata(
        data.title,
        data.description,
        imageHash,
        data.rarity,
        collections[data.category].id
      );

      executeCreateNFT({
        to: userAddress as `0x${string}`,
        jsonData: collections[data.category].name,
        newPrice: data.price,
        collectionId: data.category,
        name: data.title,
        rarity: data.rarity,
        uri: `https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/${imageHash}`,
        imageUri: `https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/${metadataHash}`,
        uid: data.uId,
        duplicates: data.count,
      });

      setCreatedNFT({
        name: data.title,
        rarity: data.rarity,
        imageUri: `https://beige-fit-hedgehog-619.mypinata.cloud/ipfs/${imageHash}`,
      });
    } catch (error) {
      console.error("Error al subir el NFT:", error);
      setAlert({ type: "error", message: `Error al subir el NFT: ${error}` });
    }
  };

  const handleCreateAnother = () => {
    setPreview(null);
    setFormSubmitted(false);
    setCreatedNFT(null);
    setAlert({ type: null, message: "" });
    reset();
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
    setAlert({ type: null, message: "" });
    reset();
  };

  const renderFormContent = () => {
    if (isWritePending) {
      return (
        <Alert type="info">
          <Spinner />
          <span>Escribiendo en el contrato. Por favor, espere...</span>
        </Alert>
      );
    }

    if (isTransactionLoading) {
      return (
        <Alert type="info">
          <Spinner />
          <span>Procesando transacción. Esto puede tardar unos minutos...</span>
        </Alert>
      );
    }

    if (alert.type) {
      return (
        <Alert type={alert.type}>
          <span>{alert.message}</span>
          {alert.type === "error" && (
            <Button onClick={handleResetForm}>Intentar de nuevo</Button>
          )}
          {alert.type === "success" && (
            <Button onClick={handleCreateAnother}>Crear otro NFT</Button>
          )}
        </Alert>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.cardImage}>
          <img
            src={
              preview ||
              "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"
            }
            alt="preview"
          />
        </div>
        <Input
          label="Imagen"
          id="imagen"
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={(e) => {
            handleImageChange(e);
            register("image").onChange(e);
          }}
          errors={errors.image?.message}
        />
        <Input
          label="UID NFT"
          id="uId"
          type="text"
          placeholder="UID"
          {...register("uId")}
          errors={errors.uId?.message}
        />

        <Input
          label="Título"
          id="title"
          type="text"
          placeholder="Título"
          {...register("title")}
          errors={errors.title?.message}
        />

        <Select
          label="Rareza"
          placeholder="Rareza"
          {...register("rarity", { valueAsNumber: true })}
          errors={errors.rarity?.message}
        >
          {rarityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          label="Colección"
          id="category"
          errors={errors.category?.message}
          {...register("category", { valueAsNumber: true })}
        >
          <option value={0}>Seleccione una colección</option>
          {collections.map((collection, index) => (
            <option key={index} value={index}>
              {collection.name}
            </option>
          ))}
        </Select>

        <Input
          label="Descripción"
          id="description"
          type="text"
          placeholder="Descripción"
          {...register("description")}
          errors={errors.description?.message}
        />

        <Input
          label="Cantidad"
          id="cantidad"
          type="number"
          min={1}
          max={1000}
          {...register("count", { valueAsNumber: true })}
          errors={errors.count?.message}
        />

        <Input
          label="Precio"
          id="precio"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          errors={errors.price?.message}
        />
        <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
          <Button
            disabled={isTransactionLoading || isWritePending}
            size="full"
            style={{ marginLeft: "auto", marginRight: "auto" }}
            type="submit"
          >
            {isTransactionLoading || isWritePending
              ? "Creando NFT..."
              : "Crear NFT"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Card style={{ maxWidth: "900px", width: "100%" }}>
      <CardHeader>
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          Creación de NFT
        </h2>
      </CardHeader>
      <CardContent>{renderFormContent()}</CardContent>

      <Modal isOpen={modalOpen} handleModal={() => setModalOpen(false)}>
        {createdNFT && (
          <NftMintCard
            name={createdNFT.name}
            onClose={() => setModalOpen(false)}
            rarity={createdNFT.rarity}
            imageUri={createdNFT.imageUri}
          />
        )}
      </Modal>
    </Card>
  );
}
