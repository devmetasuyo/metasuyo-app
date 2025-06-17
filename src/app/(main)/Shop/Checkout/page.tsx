"use client";

import { Banner,Degradado,Spinner,Modal,Button } from "@/components";
import {
  useSendTransaction,
  useTransaction,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { useEffect, useState } from "react";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";
import CheckOut from "./checkOut";
import useOrder from "@/hooks/useOrder";
import { useRouter } from "next/navigation";
import { usePrivySession } from "@/hooks/usePrivySession";
import { UserSession } from "@/components/types/user";
import QRCode from "react-qr-code";
import copy from "copy-to-clipboard";
import { Text } from "@/components";
import styles from "@/components/Modals/FeedbackModal/FeedbackModal/FeedBackModal.module.scss";
import { parseEther } from "viem";
import { privyConfig } from "@/privy";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

export default function CartPage() {
  const { session } = usePrivySession();
  const user = session as UserSession | null;
  const router = useRouter();
  const { openModal } = useFeedbackModal();

  const { order, totalItems, addItemToCart, removeItemFromCart, totalPrice } =
    useOrder();

  const { sendTransaction, data, status, isPending, isSuccess, error } = useSendTransaction();
  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: data,
  });
  const { data: receipt, isSuccess: isConfirmed } = useTransaction({
    hash: transactionReceipt?.transactionHash,
    index: transactionReceipt?.transactionIndex,
  });

  const [loading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showYapeModal, setShowYapeModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const { data: balanceData, refetch } = useBalance({
    address: user?.wallet as `0x${string}`,
    chainId: privyConfig.defaultChain?.id as number,
  });
  

  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (
      balanceData &&
      Number(balanceData.formatted) >= totalPrice &&
      !hasPaid
    ) {
      handleSend();
      setHasPaid(true);
    }
  }, [balanceData, totalPrice, hasPaid]);

  useEffect(() => {
    async function verifyTransaction() {
      try {
        if (isConfirmed) {
          // LOG: Verificando transacción PUT
          console.log('[CartPage] Verificando transacción para order.id:', order?.id, 'receipt:', receipt);
          const response = await fetch(`/api/invoices/manage?id=${order?.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: order?.id,
              total: Number(receipt?.value),
              hash: receipt.blockHash,
            }),
          });
          const data = await response.json();
          // LOG: Respuesta del backend al verificar transacción
          console.log('[CartPage] Respuesta PUT /api/invoices/manage:', data);
          if (data.status === "success") {
            openModal({
              cancelButton: undefined,
              title: "Gracias por tu compra",
              message:
                "El equipo Metasuyo se pondrá en contacto contigo en los próximos minutos!",
              type: "success",
              confirmButton: "Entendido",
              onConfirm: () => {
                router.push("/Shop");
              },
            });

            localStorage.removeItem("order");
          }
        }
      } catch (error) {
        console.error("Error al verificar la transacción:", error);
      }
    }
    verifyTransaction();
  }, [isConfirmed]);

  if (!user) {
    return <Spinner />;
  }

  function isProfileIncomplete(user: UserSession): boolean {
    return (
      !user.nombre ||
      !user.apellido ||
      !user.correo ||
      !user.telefono ||
      !user.direccion ||
      !user.tipo_documento ||
      !user.documento
    );
  }

  const handleSend = () => {
    sendTransaction({
      to: ADMIN_WALLET,
      value: parseEther(totalPrice.toString()),
    });
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
      {loading ? (
        <Spinner />
      ) : (
        <CheckOut
          onBuy={() => {
            if (isProfileIncomplete(user)) {
              openModal({
                type: "warning",
                title: "Perfil incompleto",
                message: "Debes completar tu perfil antes de pagar.",
                confirmButton: "Ir a mi perfil",
                onConfirm: () => {
                  window.location.href = `/Perfil/${user.wallet}?showModal=true`;
                },
              });
              return;
            }
            setShowPaymentMethodModal(true);
          }}
          order={order}
          onAction={(item, action) => {
            if (action === "increment") {
              addItemToCart(item);
            } else {
              if (item.quantity === 1) {
                openModal({
                  type: "warning",
                  title: "Advertencia",
                  message: "¿Este artículo será eliminado del carrito?",
                  confirmButton: "Eliminar",
                  cancelButton: "Cancelar",
                  onConfirm: (confirm) => {
                    if (confirm) removeItemFromCart(item);
                  },
                });
              } else removeItemFromCart(item);
            }
          }}
          totalItems={totalItems}
          totalPrice={totalPrice}
        />
      )}

      {/* Modal para perfil incompleto */}
      <Modal isOpen={showProfileModal} handleModal={setShowProfileModal}>
        <div style={{ padding: 24, textAlign: "center" }}>
          <h2 style={{ marginBottom: 12 }}>Perfil incompleto</h2>
          <p style={{ marginBottom: 18 }}>
            Debes completar tu perfil antes de poder realizar la compra.
          </p>
          <Button
            onClick={() => {
              setShowProfileModal(false);
              window.location.href = `/Perfil/${user?.wallet}?showModal=true`;
            }}
            style={{ marginRight: 8 }}
          >
            Ir a mi perfil
          </Button>
          <Button color="secondary" onClick={() => setShowProfileModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Modal de selección de método de pago */}
      <Modal isOpen={showPaymentMethodModal} handleModal={setShowPaymentMethodModal}>
        <div className={styles.feedbackModal}>
          <h2>¿Cómo deseas pagar?</h2>
          <Button
            style={{ margin: 8 }}
            onClick={() => {
              setShowPaymentMethodModal(false);
              setShowCryptoModal(true);
            }}
          >
            Pagar con Cripto
          </Button>
          <Button
            style={{ margin: 8 }}
            onClick={() => {
              setShowPaymentMethodModal(false);
              setShowYapeModal(true);
            }}
          >
            Pagar con YAPE (FIAT)
          </Button>
        </div>
      </Modal>

      {/* Modal de YAPE */}
      <Modal isOpen={showYapeModal} handleModal={setShowYapeModal}>
        <div className={styles.feedbackModal}>
          <h2>Paga con YAPE</h2>
          <p>Escanea el QR o transfiere a:</p>
          <img src="/yape-qr.png" alt="Yape QR" style={{ width: 200, margin: "0 auto" }} />
          <p>Celular: <b>938592837</b></p>
          <Button onClick={() => setShowYapeModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      {/* Modal de Cripto */}
      <Modal isOpen={showCryptoModal} handleModal={setShowCryptoModal}>
        <div className={styles.feedbackModal}>
          <h2>Paga con Cripto</h2>
          <Text className={styles.text}>
            Escanea este QR para fondear tu wallet Privy o copia la dirección:
          </Text>
          <div style={{ margin: "16px auto", width: 180 }}>
            <QRCode value={user?.wallet || ""} size={180} />
          </div>
          <Text className={styles.text}>
            {user?.wallet}
          </Text>
          <Button
            size="xs"
            onClick={() => copy(user?.wallet || "")}
            style={{ marginBottom: 16 }}
          >
            Copiar dirección
          </Button>
          <Text className={styles.text}>
            <b>Saldo actual:</b> {balanceData?.formatted} {balanceData?.symbol}
          </Text>
          <Text className={styles.text}>
            <b>Monto a pagar:</b> {totalPrice} {balanceData?.symbol}
          </Text>
          <Text className={styles.text}>
            Cuando tu saldo sea suficiente, el pago se enviará automáticamente a la cuenta de Metasuyo.
          </Text>
          {status === "pending" && <p>Enviando pago...</p>}
          {isSuccess && (
            <p>
              Pago realizado. Hash:{" "}
              <a href={`https://sepolia.basescan.org/tx/${data}`} target="_blank" rel="noopener noreferrer">
                {data}
              </a>
            </p>
          )}
          {error && <p style={{ color: "red" }}>Error al enviar el pago: {error.message}</p>}
          <div style={{ marginTop: 16 }}>
            <Button color="secondary" onClick={() => setShowCryptoModal(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
