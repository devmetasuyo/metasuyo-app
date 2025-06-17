"use client";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Degradado,
  Banner,
  CardNft,
  Title,
  ButtonSignIn,
  Input,
  Button,
} from "@/components";
import { CarouselMainWallet } from "@/components";
import textos from "@/utils/text.json";
import { Modal } from "@/components/common/Modal";
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
  const { session } = usePrivySession();
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
    setShowModal(!session?.wallet);
  }, [session]);

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
      <Modal isOpen={showModal} handleModal={() => {}}>
        <div
          style={{
            width: "90%",
            maxWidth: "400px",
            background: "#f5f5f5", // Fondo gris neutro
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#333", // Color de texto oscuro para contraste
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ¡Descubre nuestra colección exclusiva!
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Inicia sesión para explorar nuestra increíble colección de NFTs y
            acceder al contenido premium.
          </p>
          <ButtonSignIn
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#f5a602", // Color primario para el botón
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              fontWeight: "bold",
            }}
          >
            Únete a MetaSuyo
          </ButtonSignIn>
        </div>
      </Modal>
    </div>
  );
}
