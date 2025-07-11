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
  isWalletConnected?: boolean;
}

export default function NFTForm({ collections, userAddress, isWalletConnected = false }: NFTFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [createdNFT, setCreatedNFT] = useState<{
    name: string;
    rarity: number;
    imageUri: string;
  } | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });
  const [ethToUsdRate, setEthToUsdRate] = useState(0);
  const [penToUsdRate, setPenToUsdRate] = useState(0);
  const [usdPrice, setUsdPrice] = useState(0);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        // Fetch ETH to USD rate from CoinGecko
        const ethResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethData = await ethResponse.json();
        const ethToUsd = ethData.ethereum.usd;
        
        // Fetch USD to PEN rate
        const fiatResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const fiatData = await fiatResponse.json();
        const usdToPen = fiatData.rates.PEN;
        
        setEthToUsdRate(ethToUsd);
        setPenToUsdRate(usdToPen);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
        // Set fallback rates
        setEthToUsdRate(3000); // Approximate ETH price
        setPenToUsdRate(3.8); // Approximate USD to PEN rate
      }
    };
    fetchConversionRates();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value) || 0;
    setUsdPrice(price);
    setValue('price', price);
  };

  // Calculate converted prices
  const ethPrice = ethToUsdRate > 0 ? (usdPrice / ethToUsdRate) : 0;
  const penPrice = penToUsdRate > 0 ? (usdPrice * penToUsdRate) : 0;

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
    
    // Validaciones mejoradas
    if (!isWalletConnected) {
      setAlert({
        type: "error",
        message: "Por favor conecta tu wallet para poder crear NFTs"
      });
      return;
    }

    if (!userAddress) {
      setAlert({
        type: "error",
        message: "Dirección de wallet no disponible. Por favor reconecta tu wallet."
      });
      return;
    }

    if (!collections || collections.length === 0) {
      setAlert({
        type: "error",
        message: "No hay colecciones disponibles. Por favor recarga la página."
      });
      return;
    }

    if (!collections[data.category]) {
      setAlert({
        type: "error",
        message: "Colección seleccionada no válida."
      });
      return;
    }
    
    try {
      setAlert({
        type: "info",
        message: "Subiendo imagen a IPFS..."
      });

      const imageHash = await uploadImageToPinata(data.image[0], data.title);
      
      setAlert({
        type: "info",
        message: "Subiendo metadatos a IPFS..."
      });

      const metadataHash = await uploadMetadataToPinata(
        data.title,
        data.description,
        imageHash,
        data.rarity,
        collections[data.category].id
      );

      setAlert({
        type: "info",
        message: "Creando NFT en blockchain..."
      });

      executeCreateNFT({
        to: userAddress as `0x${string}`,
        jsonData: metadataHash,
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
      setAlert({ 
        type: "error", 
        message: `Error al crear NFT: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
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
          label="Precio (USD)"
          id="precio"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          onChange={handlePriceChange}
          errors={errors.price?.message}
        />
        <div>
          <p>Precio en ETH: {ethPrice.toFixed(6)}</p>
          <p>Precio en Soles: {penPrice.toFixed(2)}</p>
        </div>
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
