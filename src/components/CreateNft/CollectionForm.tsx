"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.scss";
import { FormData, schema } from "./validation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Spinner,
  Alert,
} from "@/components/common";
import { useCreateCollection } from "@/hooks/useCreateCollection";
import { uploadImage } from "@/utils/imageUpload";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";

const addressContract = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface CollectionFormProps {}

export default function CollectionForm({}: CollectionFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { openModal } = useFeedbackModal();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const {
    executeCreateCollection,
    isTransactionLoading,
    transactionError,
    isTransactionSuccess,
    isWritePending,
    writeError,
  } = useCreateCollection(addressContract);

  useEffect(() => {
    if (isTransactionSuccess) {
      openModal({
        title: "¡La colección se ha creado correctamente!",
        cancelButton: "Cerrar",
        type: "success",
      });
      setFormSubmitted(true);
      reset();
    }
    if (transactionError) {
      openModal({
        title: `Error en la transacción: ${transactionError.message}`,
        type: "danger",
      });
    }
    if (writeError) {
      openModal({
        title: `Error al escribir en el contrato: ${writeError.message}`,
        type: "danger",
      });
    }
  }, [isTransactionSuccess, transactionError, writeError, openModal, reset]);

  const onSubmit = async (data: FormData) => {
    setFormSubmitted(false);
    try {
      const imageUri = await uploadImage(data.image[0], data.name);
      executeCreateCollection({
        name: data.name,
        description: data.description,
        imageUri: imageUri,
      });
    } catch (error) {
      openModal({
        title: "Error al subir la imagen. Por favor, inténtelo de nuevo.",
        type: "danger",
      });
    }
  };

  const handleCreateAnother = () => {
    setPreview(null);
    setFormSubmitted(false);
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

    if (formSubmitted && isTransactionSuccess) {
      return (
        <Alert type="success">
          <span>¡La colección se ha creado correctamente!</span>
          <Button onClick={handleCreateAnother}>Crear otra colección</Button>
        </Alert>
      );
    }

    if (transactionError || writeError) {
      const errorMessage = transactionError
        ? `Error en la transacción: ${transactionError.message}`
        : `Error al escribir en el contrato: ${writeError?.message}`;

      return (
        <Alert type="error">
          <span>{errorMessage}</span>
          <Button onClick={() => setFormSubmitted(false)}>
            Intentar de nuevo
          </Button>
        </Alert>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nombre de colección"
          id="colecciones"
          type="text"
          errors={errors.name?.message}
          placeholder="Metasuyo Temporada 1"
          {...register("name")}
        />
        <Input
          label="Descripción de colección"
          id="descripcion"
          type="text"
          errors={errors.description?.message}
          placeholder="Descripción"
          {...register("description")}
        />

        <div className="input-select-container">
          <div className={styles.cardImage2}>
            <img
              src={
                preview ||
                "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"
              }
              alt="preview"
            />
          </div>
          <Input
            label="Portada de la colección"
            id="imagen"
            type="file"
            accept="image/*"
            errors={errors.image?.message}
            {...register("image")}
            onChange={handleImageChange}
          />
        </div>
        <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
          <Button
            size="full"
            type="submit"
            style={{ marginLeft: "auto", marginRight: "auto" }}
            disabled={isWritePending || isTransactionLoading}
          >
            Crear Colección
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
          Creación de Colección NFT
        </h2>
      </CardHeader>
      <CardContent>{renderFormContent()}</CardContent>
    </Card>
  );
}
