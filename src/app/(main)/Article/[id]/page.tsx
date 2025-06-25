"use client";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Degradado,
  Banner,
  CardNft,
  Title,
  Input,
  Button,
} from "@/components";
import { CarouselMainWallet } from "@/components";
import textos from "@/utils/text.json";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivySession } from "@/hooks/usePrivySession";

const schema = z.object({
  email: z.string().email("Por favor ingrese un correo electrónico válido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().regex(/^\d{9}$/, "El teléfono debe tener 9 dígitos"),
});

type FormData = z.infer<typeof schema>;

const Form = ({
  wallet,
  handleSuccess,
}: {
  wallet: string;
  handleSuccess: () => void;
}) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const response = await fetch("/api/customers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, wallet }),
    });

    const dataResponse = await response.json();
    if (dataResponse && dataResponse.status === "success") {
      setSuccess(true);
      setLoading(false);
      handleSuccess();
    }
  };

  if (success) return <></>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "1rem auto",
        maxWidth: "320px",
      }}
    >
      <div>
        <Input
          disabled={loading}
          type="email"
          placeholder="correo@example.com"
          label="Correo electrónico"
          id="email"
          {...register("email")}
          errors={errors.email && errors.email.message}
        />
      </div>
      <div>
        <Input
          disabled={loading}
          type="text"
          placeholder="Ingresa tu nombre"
          label="Nombre"
          id="name"
          {...register("name")}
          errors={errors.name && errors.name.message}
        />
      </div>
      <div>
        <Input
          disabled={loading}
          type="text"
          placeholder="Ingresa tu Apellido"
          label="Apellido"
          id="lastname"
          {...register("lastName")}
          errors={errors.name && errors.name.message}
        />
      </div>
      <div>
        <Input
          disabled={loading}
          type="text"
          placeholder="Ingresa tu teléfono"
          label="Teléfono"
          id="phone"
          {...register("phone")}
          errors={errors.phone && errors.phone.message}
        />
      </div>
      <Button disabled={loading} style={{ marginTop: "1rem" }} type="submit">
        {loading ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
};

export default function Article({ params }: { params: { id: string } }) {
  const { session, login } = usePrivySession();
  const [valid, setValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { openModal, updateModal, state } = useFeedbackModal();

  useEffect(() => {
    async function fetchData() {
      if (session?.wallet && !valid) {
        const response = await fetch("/api/customers?wallet=" + session.wallet);
        const data = await response.json();

        if (!data.customer.telefono) {
          openModal({
            title: "Información de contacto",
            message:
              "Por favor, completa tu información de contacto para poder recibir tu premio.",
            type: "warning",
            content: (
              <Form
                wallet={session.wallet}
                handleSuccess={() => {
                  setValid(true);
                  updateModal({
                    confirmButton: "Entendido",
                    type: "success",
                    message: "Gracias por tu registro.",
                    content: undefined,
                  });
                }}
              />
            ),
          });
        } else {
          setValid(true);
        }
      }
    }
    fetchData();
  }, [state.isOpen, session]);

  useEffect(() => {
    if (!session?.wallet) {
      // Abrir directamente el modal de Privy en lugar del modal custom
      login();
    }
  }, [session?.wallet, login]);

  return (
    <div style={{ background: "#040200" }}>
      <Banner
        icon={false}
        session={false}
        style={{
          height: "350px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
        }}
        subtitle={textos.common.banner}
        imageUrl="/nft-fondo.jpg"
        title={""}
      />
      <Degradado />
      <CardNft id={+params.id} />
      <Title title="Collections" />
      <CarouselMainWallet />

    </div>
  );
}
