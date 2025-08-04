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
  const [operationNumber, setOperationNumber] = useState("");
  const [isProcessingYapePayment, setIsProcessingYapePayment] = useState(false);
  const [usdToPenRate, setUsdToPenRate] = useState(3.8);

  // Estado para el formulario de perfil
  const [profileData, setProfileData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    tipo_documento: "DNI" as "DNI" | "RUC",
    documento: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { data: balanceData, refetch } = useBalance({
    address: user?.wallet as `0x${string}`,
    chainId: privyConfig.defaultChain?.id as number,
  });
  

  const [hasPaid, setHasPaid] = useState(false);

  // Función para cargar datos del perfil
  const fetchProfileData = async () => {
    try {
      console.log("🔄 [Checkout] Cargando datos del perfil para wallet:", user?.wallet);
      const response = await fetch(`/api/profile/${user?.wallet}`);
      const data = await response.json();
      
      if (data.status === "success") {
        console.log("✅ [Checkout] Datos del perfil cargados:", data.cliente);
        setProfileData({
          nombre: data.cliente.nombre || "",
          apellido: data.cliente.apellido || "",
          correo: data.cliente.correo || "",
          telefono: data.cliente.telefono || "",
          direccion: data.cliente.direccion || "",
          tipo_documento: data.cliente.tipo_documento || "DNI",
          documento: data.cliente.documento || "",
        });
        return data.cliente;
      } else {
        console.log("⚠️ [Checkout] Error al cargar datos del perfil:", data);
        return null;
      }
    } catch (error) {
      console.error("❌ [Checkout] Error fetching perfil:", error);
      return null;
    }
  };

  // Función para manejar cambios en el formulario
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`📝 [Checkout] Cambiando ${name}: ${value}`);
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para actualizar el perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    console.log("🔄 [Checkout] Actualizando perfil...", profileData);
    
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: user?.wallet,
          ...profileData,
        }),
      });

      const data = await response.json();
      console.log("📝 [Checkout] Respuesta actualización perfil:", data);
      
      if (data.status === "success") {
        console.log("✅ [Checkout] Perfil actualizado correctamente");
        
        // Actualizar los datos del perfil local inmediatamente
        console.log("🔄 [Checkout] Actualizando datos locales del perfil...");
        
        // NO volver a llamar fetchProfileData que puede sobrescribir con datos viejos
        // Los datos ya están actualizados en profileData del estado local
        
        // Cerrar el modal
        setShowProfileModal(false);
        
        // Mostrar modal de éxito y continuar con el pago
        openModal({
          type: "success",
          title: "Perfil actualizado",
          message: "Tu perfil ha sido actualizado correctamente. Ahora puedes continuar con el pago.",
          confirmButton: "Continuar",
          onConfirm: () => {
            // Verificar de nuevo el perfil con los datos actualizados
            console.log("🔍 [Checkout] Re-verificando perfil actualizado:", profileData);
            if (isProfileIncomplete()) {
              console.log("❌ [Checkout] ERROR: Perfil sigue incompleto después de actualizar");
              alert("Error: Los datos no se guardaron correctamente. Intenta de nuevo.");
              setShowProfileModal(true);
            } else {
              console.log("✅ [Checkout] Perfil completo, continuando al pago");
              setShowPaymentMethodModal(true);
            }
          },
        });
      } else {
        console.error("❌ [Checkout] Error al actualizar perfil:", data.message);
        alert(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("❌ [Checkout] Error updating profile:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Fetch conversion rate
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setUsdToPenRate(data.rates.PEN);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
        // Keep default rate
      }
    };
    fetchConversionRate();
  }, []);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (user?.wallet) {
      console.log("🔄 [Checkout] useEffect - Cargando perfil inicial para wallet:", user.wallet);
      fetchProfileData();
    }
  }, [user?.wallet]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    // El totalPrice ya está en ETH, comparamos directamente
    console.log("💰 [Checkout] Balance actual:", balanceData?.formatted, "ETH requerido:", totalPrice);
    
    if (
      balanceData &&
      Number(balanceData.formatted) >= totalPrice &&
      !hasPaid
    ) {
      console.log("✅ [Checkout] Balance suficiente, iniciando pago automático");
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

  function isProfileIncomplete(): boolean {
    console.log("🔍 [Checkout] Verificando si el perfil está incompleto:", profileData);
    
    // Verificar que todos los campos tengan valores válidos (no vacíos, no solo espacios)
    const incomplete = (
      !profileData.nombre?.trim() ||
      !profileData.apellido?.trim() ||
      !profileData.correo?.trim() ||
      !profileData.telefono?.trim() ||
      !profileData.direccion?.trim() ||
      !profileData.tipo_documento?.trim() ||
      !profileData.documento?.trim()
    );
    
    if (incomplete) {
      console.log("❌ [Checkout] Campos faltantes:", {
        nombre: !profileData.nombre?.trim() ? "FALTA" : "OK",
        apellido: !profileData.apellido?.trim() ? "FALTA" : "OK",
        correo: !profileData.correo?.trim() ? "FALTA" : "OK", 
        telefono: !profileData.telefono?.trim() ? "FALTA" : "OK",
        direccion: !profileData.direccion?.trim() ? "FALTA" : "OK",
        tipo_documento: !profileData.tipo_documento?.trim() ? "FALTA" : "OK",
        documento: !profileData.documento?.trim() ? "FALTA" : "OK"
      });
    } else {
      console.log("✅ [Checkout] Perfil completo!");
    }
    
    return incomplete;
  }

  const handleSend = async () => {
    try {
      // Primero crear la orden en la base de datos si no existe
      console.log("Creando orden en la base de datos para pago crypto...");
      await createOrderInDatabase();
      console.log("Orden creada exitosamente para pago crypto");

      // El totalPrice ya está en ETH, lo enviamos directamente
      console.log("💰 [Checkout] Enviando transacción en ETH:", totalPrice);
      sendTransaction({
        to: ADMIN_WALLET,
        value: parseEther(totalPrice.toString()),
      });
    } catch (error) {
      console.error("Error al crear orden para pago crypto:", error);
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const createOrderInDatabase = async () => {
    if (!order?.id || !user?.wallet) {
      throw new Error("No se encontró la orden o el usuario");
    }

    const productosInList = Object.values(order.cart).map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const response = await fetch("/api/invoices/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: user.wallet,
        id: order.id,
        productosInList
      }),
    });

    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Error al crear la orden");
    }
    
    return data.order;
  };

  const handleYapePayment = async () => {
    if (!operationNumber.trim()) {
      alert("Por favor ingresa el número de operación");
      return;
    }

    if (!order?.id) {
      alert("No se encontró la orden");
      return;
    }

    setIsProcessingYapePayment(true);

    try {
      // Primero crear la orden en la base de datos si no existe
      console.log("Creando orden en la base de datos...");
      await createOrderInDatabase();
      console.log("Orden creada exitosamente");

      // Ahora marcar la factura como pagada con el número de operación
      const response = await fetch(`/api/invoices/manage?id=${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          total: totalPrice, // El total ya está en USD como se espera
          hash: `YAPE-${operationNumber}`, // Prefijo para identificar pagos YAPE
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        openModal({
          cancelButton: undefined,
          title: "¡Pago registrado exitosamente!",
          message: "Tu pago con YAPE ha sido registrado. El equipo Metasuyo se pondrá en contacto contigo para confirmar y procesar tu orden.",
          type: "success",
          confirmButton: "Entendido",
          onConfirm: () => {
            localStorage.removeItem("order");
            router.push("/Shop");
          },
        });
        
        setShowYapeModal(false);
        setOperationNumber("");
      } else {
        throw new Error(data.message || "Error al procesar el pago");
      }
    } catch (error) {
      console.error("Error al procesar pago YAPE:", error);
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessingYapePayment(false);
    }
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
            console.log("🛒 [Checkout] Botón Pagar presionado");
            if (isProfileIncomplete()) {
              console.log("⚠️ [Checkout] Perfil incompleto, mostrando modal de edición");
              setShowProfileModal(true);
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

      {/* Modal para completar perfil */}
      <Modal isOpen={showProfileModal} handleModal={setShowProfileModal}>
        <div style={{ 
          padding: 24, 
          maxWidth: 500, 
          backgroundColor: "white", 
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          margin: "auto"
        }}>
          <h2 style={{ 
            marginBottom: 16, 
            textAlign: "center",
            color: "#333",
            fontSize: "24px",
            fontWeight: "600"
          }}>Completar Perfil</h2>
          <p style={{ 
            marginBottom: 20, 
            textAlign: "center", 
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            Para continuar con tu compra, necesitamos completar tu información de perfil:
          </p>
          
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="nombre"
                value={profileData.nombre}
                onChange={handleProfileInputChange}
                placeholder="Nombre (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="apellido"
                value={profileData.apellido}
                onChange={handleProfileInputChange}
                placeholder="Apellido (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="correo"
                value={profileData.correo}
                onChange={handleProfileInputChange}
                placeholder="Correo electrónico (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <input
                type="tel"
                name="telefono"
                value={profileData.telefono}
                onChange={handleProfileInputChange}
                placeholder="Teléfono (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="direccion"
                value={profileData.direccion}
                onChange={handleProfileInputChange}
                placeholder="Dirección (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <select
                name="tipo_documento"
                value={profileData.tipo_documento}
                onChange={handleProfileInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                name="documento"
                value={profileData.documento}
                onChange={handleProfileInputChange}
                placeholder="Número de documento (obligatorio)"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Button 
                type="submit" 
                disabled={isUpdatingProfile}
                style={{ minWidth: "120px" }}
              >
                {isUpdatingProfile ? "Guardando..." : "Guardar y Continuar"}
              </Button>
              <Button 
                type="button"
                color="secondary" 
                onClick={() => setShowProfileModal(false)}
                disabled={isUpdatingProfile}
                style={{ minWidth: "120px" }}
              >
                Cancelar
              </Button>
            </div>
          </form>
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
          <img src="/qr.jpg" alt="Yape QR" style={{ width: 200, margin: "0 auto" }} />
          <p>Celular: <b> 958 824 559 </b></p>
          <p><b>Monto a pagar: S/ {((totalPrice * (Number(localStorage.getItem("price")) || 3000)) * usdToPenRate).toFixed(2)}</b></p>
          <div style={{ 
            backgroundColor: "#f0f8ff", 
            padding: "12px", 
            borderRadius: "8px", 
            margin: "16px 0",
            border: "1px solid #e0e7ff"
          }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#1e40af" }}>
              📋 <strong>IMPORTANTE:</strong> En el concepto del yapeo, incluye esta referencia:
            </p>
            <p style={{ 
              margin: "8px 0 0 0", 
              fontSize: "16px", 
              fontWeight: "bold", 
              color: "#dc2626",
              textAlign: "center",
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "4px"
            }}>
              ORDEN: {order?.id?.slice(-8).toUpperCase() || "N/A"}
            </p>
          </div>
          
          <div style={{ margin: "16px 0" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Número de operación:
            </label>
            <input
              type="text"
              placeholder="Ingresa el número de operación de YAPE"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px"
              }}
              disabled={isProcessingYapePayment}
            />
          </div>
          
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Button 
              onClick={handleYapePayment}
              disabled={isProcessingYapePayment || !operationNumber.trim()}
              color="primary"
            >
              {isProcessingYapePayment ? "Procesando..." : "Marcar como pagado"}
            </Button>
            <Button 
              onClick={() => setShowYapeModal(false)}
              color="secondary"
              disabled={isProcessingYapePayment}
            >
              Cancelar
            </Button>
          </div>
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
            <b>Monto total: ${(totalPrice * (Number(localStorage.getItem("price")) || 3000)).toFixed(2)} USD</b>
          </Text>
          <Text className={styles.text}>
            <b>Monto a pagar:</b> {totalPrice.toFixed(6)} {balanceData?.symbol}
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
