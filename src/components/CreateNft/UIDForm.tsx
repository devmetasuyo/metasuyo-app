import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Spinner,
  Alert,
} from "../common";
import UIDList from "./UIDList";
import { useCreateUIDs } from "@/hooks/useCreateUIDs";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";

const schema = z.object({
  uId: z.string().min(1, "El UID es requerido"),
});

type FormData = z.infer<typeof schema>;

interface Props {}

const addressContract = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function UIDForm({}: Props) {
  const [uids, setUids] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { openModal } = useFeedbackModal();

  const {
    executeGenerateUIDs,
    isWritePending,
    writeError,
    isTransactionSuccess,
    isTransactionLoading,
    transactionError,
  } = useCreateUIDs(addressContract);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = (data: FormData) => {
    if (data.uId.trim() !== "") {
      const newUids = data.uId
        .split(",")
        .map((uid) => uid.trim().replace(/\s+/g, ""))
        .filter((uid) => uid !== "");

      const allUids = [...uids, ...newUids];
      const uniqueUids = Array.from(new Set(allUids));

      if (allUids.length !== uniqueUids.length) {
        setDuplicateWarning(
          "Se detectaron códigos duplicados. Se han eliminado los duplicados."
        );
      } else {
        setDuplicateWarning(null);
      }

      setUids(uniqueUids);
      setValue("uId", "");
    }
  };

  const handleAddUid = () => {
    handleSubmit(handleFormSubmit)();
  };

  const handleRemoveUid = (index: number) => {
    setUids(uids.filter((_, i) => i !== index));
  };

  const handleCreateUIDs = () => {
    if (uids.length > 0) {
      setFormSubmitted(true);
      executeGenerateUIDs(uids);
    }
  };

  useEffect(() => {
    if (writeError) {
      openModal({
        title: `Error al escribir en el contrato`,
        type: "danger",
        message: writeError.message,
      });
      setFormSubmitted(false);
    } else if (transactionError) {
      openModal({
        title: `Error durante la transacción`,
        type: "danger",
        message: transactionError.message,
      });
      setFormSubmitted(false);
    } else if (isTransactionSuccess) {
      openModal({
        title: "UIDs creados con éxito",
        type: "success",
        message:
          "Los UIDs han sido creados exitosamente. Puedes verlos en la sección de UIDs.",
      });
      reset();
    }
  }, [writeError, transactionError, isTransactionSuccess, openModal, reset]);

  const getButtonText = () => {
    if (isWritePending) return "Iniciando transacción...";
    if (isTransactionLoading) return "Procesando transacción...";
    return "Crear UIDs";
  };

  const handleCreateAnother = () => {
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
          <span>UIDs creados con éxito</span>
          <Button onClick={handleCreateAnother}>Crear más UIDs</Button>
        </Alert>
      );
    }

    if (writeError || transactionError) {
      const errorMessage = writeError
        ? `Error al iniciar la transacción: ${writeError.message}`
        : `Error durante la transacción: ${transactionError?.message}`;

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
      <>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Input
              label="Código"
              id="uId"
              type="text"
              errors={errors.uId?.message}
              placeholder="XXXX-XXXXX-XXXX"
              {...register("uId")}
              style={{ flexGrow: 1, marginRight: "10px" }}
            />
            <Button
              style={{
                marginBottom: "6px",
              }}
              type="button"
              onClick={handleAddUid}
            >
              +
            </Button>
          </div>
        </form>
        {duplicateWarning && <Alert type="info">{duplicateWarning}</Alert>}
        <UIDList setUids={setUids} uids={uids} onRemoveUid={handleRemoveUid} />
        <Button
          onClick={handleCreateUIDs}
          disabled={uids.length === 0 || isWritePending || isTransactionLoading}
          style={{ marginTop: "20px" }}
        >
          {getButtonText()}
        </Button>
      </>
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
          Creación Códigos promocionales
        </h2>
      </CardHeader>
      <CardContent>{renderFormContent()}</CardContent>
    </Card>
  );
}
