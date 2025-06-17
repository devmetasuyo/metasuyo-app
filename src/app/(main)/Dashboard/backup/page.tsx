"use client";

import { useState } from "react";
import { Banner, Degradado, Title } from "@/components";
import styles from "./backup.module.css";

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const credentials = `${user}:${password}`;
      const base64Credentials = btoa(credentials);

      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Contraseña incorrecta o error al crear el backup");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess("Backup creado exitosamente");
      setShowPasswordModal(false);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Banner
        title="Backup del Sistema"
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        subtitle=""
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <Title title="Gestión de Backups" />

      <div className={styles.container}>
        <div className={styles.backupCard}>
          <h2>Crear Backup de la Base de Datos</h2>
          <p className={styles.description}>
            Esta acción creará una copia de seguridad de todos los datos del
            sistema, incluyendo clientes, facturas y productos.
          </p>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button
            className={styles.backupButton}
            onClick={() => setShowPasswordModal(true)}
            disabled={isLoading}
          >
            Crear Backup
          </button>
        </div>

        {showPasswordModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Ingrese la contraseña de administrador</h3>
              <form onSubmit={handleBackup}>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Usuario"
                  className={styles.passwordInput}
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className={styles.passwordInput}
                  required
                />
                <div className={styles.modalButtons}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                      setError(null);
                    }}
                    className={styles.cancelButton}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.confirmButton}
                    disabled={isLoading || !password}
                  >
                    {isLoading ? "Creando backup..." : "Confirmar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
