"use client";

import {
  Banner,
  Button,
  Card,
  CardContent,
  Degradado,
  Input,
} from "@/components";
import { Product, productSchema } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type FormData = {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <>
      <Banner
        icon={false}
        session={false}
        style={{
          height: "350px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
        }}
        title="Marketplace"
        subtitle="Coleccionable de los Mundos de Metasuyo"
        imageUrl="/fondo.jpg"
      />
      <Degradado />
      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          display: "flex",
        }}
      >
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Nombre"
                id="colecciones"
                type="text"
                errors={errors.nombre?.message}
                placeholder="Producto"
                {...register("nombre")}
              />

              <Input
                label="Categoria"
                id="categoria"
                type="text"
                errors={errors.descripcion?.message}
                placeholder="Categoria"
                {...register("categoria")}
              />

              <Input
                label="Descripción"
                id="descripcion"
                type="text"
                errors={errors.descripcion?.message}
                placeholder="Descripción"
                {...register("descripcion")}
              />

              <Input
                label="Precio"
                id="precio"
                type="number"
                errors={errors.descripcion?.message}
                placeholder="Precio"
                {...register("precio")}
              />

              <div
                style={{ width: "100%", display: "flex", marginTop: "20px" }}
              >
                <Button
                  size="full"
                  type="submit"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                >
                  Crear Colección
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
