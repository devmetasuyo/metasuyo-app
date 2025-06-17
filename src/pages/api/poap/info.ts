import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { qr_hash } = req.query;
  const client_id = process.env.NEXT_PUBLIC_POAP_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_POAP_CLIENT_SECRET;
  const api_key = process.env.NEXT_PUBLIC_POAP_API_KEY;

  console.log("[POAP][INFO] qr_hash:", qr_hash);
  if (!qr_hash) {
    console.log("[POAP][INFO] Faltante: qr_hash");
    return res.status(400).json({ error: "Falta el qr_hash" });
  }
  if (!client_id || !client_secret || !api_key) {
    console.log("[POAP][INFO] Faltante: client_id, client_secret o api_key");
    return res.status(400).json({ error: "Faltan client_id, client_secret o api_key" });
  }

  try {
    // 1. Obtener access token
    console.log("[POAP][INFO] Solicitando access token...");
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
    if (!accessToken) {
      console.log("[POAP][INFO] Error obteniendo access token:", tokenData);
      return res.status(401).json({ error: "No se pudo obtener access token", details: tokenData });
    }

    // 2. Consultar info del QR usando Bearer token y X-API-Key
    const url = `https://api.poap.tech/actions/claim-qr?qr_hash=${qr_hash}`;
    console.log("[POAP][INFO] Consultando URL:", url);
    const poapRes = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": api_key,
      },
    });
    const data = await poapRes.json();
    console.log("[POAP][INFO] Respuesta POAP QR:", poapRes.status, !!data.event ? "event found" : "no event");
    if (!poapRes.ok) {
      console.log("[POAP][INFO] Error respuesta POAP:", data);
      return res.status(poapRes.status).json({ error: data.error || data.message || "No se pudo obtener el POAP" });
    }

    res.status(200).json({
      poapData: data.event
        ? {
            event: {
              name: data.event.name,
              description: data.event.description,
              image_url: data.event.image_url,
              city: data.event.city,
              country: data.event.country,
            },
          }
        : null,
      codesAvailable: !!data.event && !data.claimed,
    });
  } catch (err: any) {
    console.log("[POAP][INFO] Exception:", err);
    res.status(500).json({ error: err.message });
  }
}