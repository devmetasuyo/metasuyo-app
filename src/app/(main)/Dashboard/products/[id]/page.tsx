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
  const [priceMode, setPriceMode] = useState<'ETH' | 'USD'>('USD');
  const [inputValue, setInputValue] = useState('');

  const id = params.id;
  const {
    reset,
    register,
    handleSubmit,
    watch,
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
          const ethPrice = +data.product.precio;
          reset({
            cantidad: data.product?.cantidad ?? 0,
            categoria: data.product.categoria,
            nombre: data.product.nombre,
            descripcion: data.product.descripcion,
            precio: ethPrice,
          });
          // Inicializar el input con el precio en USD por defecto
          setInputValue((ethPrice * 3000).toFixed(2));
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

  // Get current price from form
  const currentPrice = watch('precio') || 0;
  
  // Calcular precios para mostrar
  const usdPrice = currentPrice * ethToUsdRate;
  const ethPrice = currentPrice;
  const penPrice = usdPrice * penToUsdRate;

  // Inicializar inputValue cuando se carguen las tasas de conversión
  useEffect(() => {
    if (ethToUsdRate > 0 && currentPrice > 0 && !inputValue) {
      setInputValue((currentPrice * ethToUsdRate).toFixed(2));
    }
  }, [ethToUsdRate, currentPrice, inputValue]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPrice = parseFloat(event.target.value) || 0;
    setInputValue(event.target.value);
    
    if (priceMode === 'USD') {
      // Convertir USD a ETH
      const ethPrice = ethToUsdRate > 0 ? inputPrice / ethToUsdRate : 0;
      setValue('precio', ethPrice);
    } else {
      // Ya está en ETH
      setValue('precio', inputPrice);
    }
  };

  const handleModeChange = (newMode: 'ETH' | 'USD') => {
    setPriceMode(newMode);
    
    // Actualizar el valor del input cuando cambie el modo
    if (newMode === 'USD') {
      setInputValue(usdPrice.toFixed(2));
    } else {
      setInputValue(ethPrice.toFixed(6));
    }
  };

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
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Precio
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={priceMode}
                    onChange={(e) => handleModeChange(e.target.value as 'ETH' | 'USD')}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "white",
                      fontSize: "14px"
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="ETH">ETH</option>
                  </select>
                  <input
                    type="number"
                    step={priceMode === 'USD' ? "0.01" : "0.000001"}
                    value={inputValue}
                    onChange={handlePriceChange}
                    placeholder={priceMode === 'USD' ? "100.00" : "0.001"}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                {errors.precio?.message && (
                  <span style={{ color: "red", fontSize: "12px" }}>{errors.precio.message}</span>
                )}
              </div>
              
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                <p><strong>Conversiones en tiempo real:</strong></p>
                <p>Precio en USD: <strong>${usdPrice.toFixed(2)}</strong></p>
                <p>Precio en ETH: <strong>{ethPrice.toFixed(6)} ETH</strong></p>
                <p>Precio en Soles: <strong>S/ {penPrice.toFixed(2)}</strong></p>
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
