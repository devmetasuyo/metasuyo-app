import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const dynamic = "force-dynamic";
export const maxRequestBodySize = "10mb"; // Opcional

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // Parsear el form-data
    const form = formidable();
    const data: any = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req as any, (err: any, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { fields, files } = data;
    const imageFileRaw = files.image;
    const imageFile = Array.isArray(imageFileRaw) ? imageFileRaw[0] : imageFileRaw;
    console.log("[POAP][API] Campos recibidos:", fields);
    console.log("[POAP][API] Archivo recibido:", imageFile);

    // Construir el form-data para POAP
    const formData = new FormData();
    for (const key in fields) {
      formData.append(key, fields[key] as string);
    }
    // Adjuntar la imagen
    if (imageFile && imageFile.filepath) {
      const buffer = await fs.promises.readFile(imageFile.filepath);
      const blob = new Blob([buffer], { type: imageFile.mimetype });
      formData.append(
        "image",
        blob,
        imageFile.originalFilename // solo filename aquí
      );
      console.log("[POAP][API] Imagen adjuntada al formData:", imageFile.originalFilename);
    } else {
      console.log("[POAP][API] No se adjuntó imagen.");
    }

    const POAP_API_KEY = process.env.NEXT_PUBLIC_POAP_API_KEY;
    console.log("[POAP][API] Enviando a POAP con API KEY:", !!POAP_API_KEY);

    // Enviar a la API de POAP
    const poapRes = await fetch("https://api.poap.tech/events", {
      method: "POST",
      headers: {
        ...(POAP_API_KEY ? { "x-api-key": POAP_API_KEY } : {}),
      },
      body: formData as any,
    });

    console.log("[POAP][API] Status respuesta POAP:", poapRes.status, poapRes.statusText);
    const text = await poapRes.text();
    console.log("[POAP][API] Respuesta cruda POAP:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { error: "Respuesta no es JSON", raw: text };
    }

    if (!poapRes.ok) {
      console.error("[POAP][API] Error de POAP:", result);
      res.status(poapRes.status).json(result);
      return;
    }
    console.log("[POAP][API] Evento creado:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("[POAP][API] Error inesperado:", err);
    res.status(500).json({
      error: "Error en el servidor: " + (err as any)?.message,
    });
  }
}