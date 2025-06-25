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
import { uploadImage } from "@/utils/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormDataProduct = {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  cantidad: number;
  image?: FileList;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [editing, setEditing] = useState(false);
  const [ethToUsdRate, setEthToUsdRate] = useState(0);
  const [penToUsdRate, setPenToUsdRate] = useState(0);
  const [usdPrice, setUsdPrice] = useState(0);

  const id = params.id;
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
  });

  async function onSubmit(data: FormDataProduct) {
    let imageUri = null;

    if (data.image && data.image.length > 0) {
      imageUri = await uploadImage(data.image[0], data.nombre);
    }

    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        ...data,
        image: imageUri,
      }),
    });
    const dataResponse = await response.json();
    if (dataResponse.status === "success") {
      alert("Se a creado su prodcuto con exito");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "new") {
        const response = await fetch(`/api/products/${id}`, {
          method: "GET",
        });

        const data = await response.json();

        if (data.status === "success") {
          reset({
            cantidad: data.product?.cantidad ?? 0,
            categoria: data.product.categoria,
            nombre: data.product.nombre,
            descripcion: data.product.descripcion,
            precio: +data.product.precio,
          });
        }
      }
    };

    fetchData();
    setEditing(true);
  }, []);

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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value) || 0;
    setUsdPrice(price);
    setValue('precio', price);
  };

  // Calculate converted prices
  const ethPrice = ethToUsdRate > 0 ? (usdPrice / ethToUsdRate) : 0;
  const penPrice = penToUsdRate > 0 ? (usdPrice * penToUsdRate) : 0;

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
          marginTop: "2rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Image"
                id="image"
                type="file"
                errors={errors.image?.message}
                placeholder="Imagen"
                {...register("image")}
              />

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
                errors={errors.categoria?.message}
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
                label="Precio (USD)"
                id="precio"
                type="number"
                step="0.01"
                {...register("precio", { valueAsNumber: true })}
                onChange={handlePriceChange}
                errors={errors.precio?.message}
              />
              <div>
                <p>Precio en ETH: {ethPrice.toFixed(6)}</p>
                <p>Precio en Soles: {penPrice.toFixed(2)}</p>
              </div>
              <Input
                label="Cantidad"
                id="cantidad"
                type="number"
                step={0.00000000005}
                errors={errors.cantidad?.message}
                placeholder="cantidad"
                {...register("cantidad", {
                  valueAsNumber: true,
                })}
              />

              <div
                style={{ width: "100%", display: "flex", marginTop: "20px" }}
              >
                <Button
                  size="full"
                  type="submit"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                >
                  Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
