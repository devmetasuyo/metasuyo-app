"use client";

import { usePrivySession } from "@/hooks/usePrivySession";
import { useState } from "react";
export default function CreatexxPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ eventId: number; secretCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { session } = usePrivySession();

  if (!session?.isAdmin) {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  // Form state
  const [form, setForm] = useState({
    name: "Test Drop",
    description: "Test event for POAP integration. (test 1 of 1)",
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    expiry_date: "",
    year: new Date().getFullYear(),
    event_url: "",
    virtual_event: true,
    image: "",
    secret_code: "",
    email: "",
    requested_codes: 50,
    private_event: false,
  });

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" && target instanceof HTMLInputElement
        ? target.checked
        : value,
    }));
  };

  // Actualiza para guardar el archivo
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setForm((prev) => ({ ...prev, image: "" })); // Limpiar la URL previa si la hay
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!form.secret_code || form.secret_code.length !== 6) {
      setError("El código secreto debe tener 6 dígitos.");
      setLoading(false);
      return;
    }
    if (!form.email || !form.email.includes("@")) {
      setError("Debes ingresar un email válido.");
      setLoading(false);
      return;
    }
    if (!form.event_url.startsWith("https://")) {
      setError("La URL del evento debe comenzar con https://");
      setLoading(false);
      return;
    }
    if (!imageFile) {
      setError("Debes subir la imagen del POAP.");
      setLoading(false);
      return;
    }

    try {
      // Construir FormData
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image") formData.append(key, value as any);
      });
      formData.append("image", imageFile);

      const response = await fetch("/api/poap/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonErr) {
          errorData = { error: "No se pudo parsear el error de la API." };
        }
        setError(errorData?.error || "Error al crear el evento.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult({ eventId: data.id, secretCode: form.secret_code });
      setLoading(false);
    } catch (err) {
      setError("Error al crear el evento. Intenta nuevamente.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: "16px",
        margin: "2rem auto",
        maxWidth: "480px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
        Crear POAP de Test
      </h1>
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <label>
          Título (incluye "test"):
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Ciudad:
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          País:
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Fecha inicio:
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Fecha de expiración:
          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Año:
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          URL del evento:
          <input
            type="text"
            name="event_url"
            value={form.event_url}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          ¿Evento virtual?
          <input
            type="checkbox"
            name="virtual_event"
            checked={form.virtual_event}
            onChange={handleChange}
            style={{ marginLeft: 8, marginBottom: 8 }}
          />
        </label>
        <label>
          Imagen (500x500, .png/.webp):
          <input
            type="file"
            accept="image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        {imageFile && (
          <div style={{ marginBottom: 8 }}>
            <img src={URL.createObjectURL(imageFile)} alt="POAP" style={{ maxWidth: 120, borderRadius: 8 }} />
          </div>
        )}
        <label>
          Código secreto (6 dígitos):
          <input
            type="text"
            name="secret_code"
            value={form.secret_code}
            onChange={handleChange}
            required
            maxLength={6}
            minLength={6}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Cantidad de mint links (máx 10 para test):
          <input
            type="number"
            name="requested_codes"
            value={form.requested_codes}
            onChange={handleChange}
            min={1}
            max={200}
            required
            style={{ width: "100%", marginBottom: 16 }}
          />
        </label>
        <label>
          Evento privado:
          <input
            type="checkbox"
            name="private_event"
            checked={form.private_event}
            onChange={handleChange}
            style={{ marginLeft: 8, marginBottom: 16 }}
          />
        </label>
        <button
          type="submit"
          disabled={loading || uploading}
          style={{
            background: "var(--primary-color)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Creando..." : "Crear POAP"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: 12, textAlign: "center" }}>{error}</div>
        )}
        {result && (
          <div
            style={{
              background: "#e6ffe6",
              color: "#1a7f37",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            <strong>¡Evento creado!</strong>
            <br />
            ID del evento: {result.eventId}
            <br />
            Código secreto: {result.secretCode}
            <br />
            <span style={{ fontSize: "0.95em" }}>
              Guarda el código secreto para editar o pedir más mint links.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}