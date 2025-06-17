import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event_id = process.env.NEXT_PUBLIC_POAP_EVENT_ID;
  const secret_code = process.env.NEXT_PUBLIC_POAP_SECRET_CODE;
  const api_key = process.env.NEXT_PUBLIC_POAP_API_KEY;
  const client_id = process.env.NEXT_PUBLIC_POAP_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_POAP_CLIENT_SECRET;

  console.log("[POAP][API] event_id:", event_id);
  console.log("[POAP][API] secret_code:", secret_code);
  console.log("[POAP][API] api_key:", api_key);
  console.log("[POAP][API] client_id:", client_id);
  console.log("[POAP][API] client_secret:", client_secret ? "[HIDDEN]" : undefined);

  if (!event_id || !secret_code || !client_id || !client_secret) {
    console.log("[POAP][API] Faltan event_id, secret_code, client_id o client_secret");
    return res.status(400).json({ error: "Faltan event_id, secret_code, client_id o client_secret" });
  }

  try {
    // 1. Obtener access token
    const tokenRes = await fetch("https://auth.accounts.poap.xyz/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience: "https://api.poap.tech",
        grant_type: "client_credentials",
        client_id,
        client_secret,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    console.log("[POAP][API] Access token obtenido:", !!accessToken);
    if (!accessToken) {
      return res.status(401).json({ error: "No se pudo obtener access token", details: tokenData });
    }

    // 2. Consultar los hashes
    const url = `https://api.poap.tech/event/${event_id}/qr-codes`;
    console.log("[POAP][API] Fetching:", url);
    const poapRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": api_key || "",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ secret_code }),
    });
    console.log("[POAP][API] Status:", poapRes.status);
    if (!poapRes.ok) {
      const err = await poapRes.text();
      console.log("[POAP][API] Error response:", err);
      return res.status(400).json({ error: err });
    }

    const data = await poapRes.json();
    console.log("[POAP][API] Data received:", JSON.stringify(data, null, 2)); // Log completo de la respuesta

    // Validar que data sea un array
    if (!Array.isArray(data)) {
      console.log("[POAP][API] La respuesta no es un array");
      return res.status(400).json({ error: "La respuesta no es un array" });
    }

    // Filtrar hashes no reclamados
    const availableHashes = data.filter((hash: { qr_hash: string; claimed: boolean }) => !hash.claimed);
    console.log("[POAP][API] Available hashes:", availableHashes);

    // Si no hay hashes disponibles, devolver un mensaje claro
    if (availableHashes.length === 0) {
      console.log("[POAP][API] No hay hashes disponibles");
      return res.status(200).json({ hashes: [], message: "No hay hashes disponibles para reclamar" });
    }

    // Devolver solo los hashes no reclamados
    res.status(200).json({ hashes: availableHashes.map((hash: { qr_hash: string }) => hash.qr_hash) });
  } catch (err: any) {
    console.log("[POAP][API] Exception:", err);
    res.status(500).json({ error: err.message });
  }
}