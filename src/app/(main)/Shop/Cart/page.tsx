"use client";

import styles from "./Cart.module.scss";
import { Banner, Degradado, Spinner, Alert, Button } from "@/components";
import {
  useSendTransaction,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BaseError, parseEther } from "viem";
import useOrder from "@/hooks/useOrder";
import Image from "next/image";

const toAddress = "0xD2417A0fa4836876c75a71dfD49829353e526a3f";

export default function CartPage() {
  const { order } = useOrder();

  const router = useRouter();
  const chainId = useChainId();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);

  const {
    data: hash,
    sendTransaction,
    isPending,
    isSuccess,
    error,
  } = useSendTransaction({
    mutation: {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: async function (data, variables, context) {
        const response = await fetch(`/api/invoices/manage?id=${order?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order?.id,
            hash: data,
          }),
        });

        const dataResponse = await response.json();

        if (dataResponse) {
          alert("Transacción exitosa");
        }
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  //Checkear si la orden es la misma del backedn a la que esta en localstorage

  useEffect(() => {
    async function getInvoice() {
      const response = await fetch(`/api/invoices/${params.get("id")}`);
      const data = await response.json();
      if (data.status === "success") {
        const orderBackend = data.invoice;
        if (
          orderBackend.estado === "pendiente" ||
          orderBackend.id !== order?.id
        ) {
          setLoading(false);
        } else {
          router.replace("/Shop");
        }
      } else {
        router.replace("/Shop");
      }
    }

    getInvoice();
  }, []);

  const handleProductCountChange = (action: "decrement" | "increment") => {
    // if (action === "increment") {
    //   setProductCount(productCount + 1);
    // } else if (action === "decrement" && productCount > 1) {
    //   setProductCount(productCount - 1);
    // }
  };

  return (
    <>
      <Banner
        title={"Carrito"}
        subtitle={""}
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />

      <div className={styles.cartContainer}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {order &&
              Object.values(order.cart).map((product) => (
                <>
                  <div className={styles.cartItems}>
                    <div className={styles.itemCard}>
                      <Image
                        src={product.imageSrc}
                        alt={product.name}
                        width={100}
                        height={100}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>{product.name}</div>
                        <div className={styles.textSecondary}>
                          {product.name}
                        </div>
                        <div
                          className={styles.textMuted}
                          style={{ fontSize: "0.875rem" }}
                        >
                          {product.quantity}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <div className={styles.itemPrice}>
                            {product.price}
                          </div>
                          <div className={styles.quantitySelector}>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleProductCountChange("decrement")
                              }
                            >
                              -
                            </Button>
                            <span className={styles.textPrimary}>
                              {product.quantity}
                            </span>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleProductCountChange("increment")
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}

            <div className={styles.cartSummary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Resumen Del Pedido</h2>
                <div
                  className={styles.summaryItem}
                  style={{ fontWeight: "bold" }}
                >
                  <span className={styles.textPrimary}>Precio aproximado:</span>
                  <span className={styles.textPrimary}>
                    {/* ${(product.price * product.quantity).toFixed(2)} */}
                  </span>
                </div>

                <Button
                  className={styles.checkoutButton}
                  onClick={async () => {
                    if (!order) return;

                    console.log(order?.id);
                    const productos = Object.values(order.cart).map((item) => ({
                      id: item.id,
                      sub_total: item.price * item.quantity,
                      cantidad: item.quantity,
                    }));

                    const response = await fetch(
                      "/api/invoices/" + order?.id + "/check",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          productos,
                        }),
                      }
                    );
                    const data = await response.json();

                    if (data.status === "success") {
                      const orderTotal = (
                        data.order.total / 3000000
                      ).toString();

                      sendTransaction({
                        to: data.toAddress as `0x${string}`,
                        value: parseEther(orderTotal),
                        chainId,
                      });
                    }
                  }}
                >
                  Pagar ahora
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <Alert type="info">
        {isPending && "Enviando pago"}
        {isSuccess && "Pago Enviado"}
        {error && (
          <p>Error: {(error as BaseError).shortMessage || error.message}</p>
        )}
        {isConfirming && (
          <div>
            <p>Transacción pendiente</p>
            <p>Hash: {hash}</p>
          </div>
        )}
        {isConfirmed && (
          <div>
            <p>Transacción confirmada</p>
            <p>Hash: {hash}</p>
          </div>
        )}
        {}
      </Alert>
    </>
  );
}
