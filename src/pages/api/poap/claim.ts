import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const CLAIMED_FILE = path.resolve(process.cwd(), "claimedWallets.json");

function getClaimedWallets(): string[] {
  try {
    const data = fs.readFileSync(CLAIMED_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveClaimedWallets(wallets: string[]) {
  fs.writeFileSync(CLAIMED_FILE, JSON.stringify(wallets, null, 2), "utf-8");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { qr_hash, address, name, email } = req.body;
  const secret = process.env.NEXT_PUBLIC_POAP_SECRET_CODE;
  const client_id = process.env.NEXT_PUBLIC_POAP_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_POAP_CLIENT_SECRET;
  const api_key = process.env.NEXT_PUBLIC_POAP_API_KEY;

  const normalizedAddress = (address || "").toLowerCase();

  // 1. Verifica si la wallet ya reclamó
  const claimedWallets = getClaimedWallets();
  if (claimedWallets.includes(normalizedAddress)) {
    return res.status(400).json({
      error: "Esta wallet ya reclamó este POAP. Gracias por participar, solo puedes reclamar una vez.",
      alreadyClaimed: true,
    });
  }

  // 2. Obtener access token
  try {
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
    console.log("[POAP][CLAIM] Access token obtenido:", !!accessToken, accessToken?.slice(0, 10));
    if (!accessToken) {
      console.log("[POAP][CLAIM] Error obteniendo access token:", tokenData);
      return res.status(401).json({ error: "No se pudo obtener access token", details: tokenData });
    }

    // 3. Reclamar el POAP usando Bearer token y X-API-Key
    console.log("[POAP][CLAIM] Enviando claim para QR:", qr_hash, "address:", address);
    const claimRes = await fetch("https://api.poap.tech/actions/claim-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": api_key || "",
      },
      body: JSON.stringify({
        qr_hash,
        secret,
        address,
        name,
        email,
      }),
    });
    const data = await claimRes.json();
    console.log("[POAP][CLAIM] Respuesta claim:", claimRes.status, data.tokenId || data.token_id ? "tokenId recibido" : "sin tokenId");
    if (!claimRes.ok) {
      console.log("[POAP][CLAIM] Error respuesta claim:", data);
      return res.status(claimRes.status).json({ error: data.error || data.message || "No se pudo reclamar el POAP" });
    }

    // 4. Guarda la wallet como ya reclamada
    claimedWallets.push(normalizedAddress);
    saveClaimedWallets(claimedWallets);

    res.status(200).json({ tokenId: data.tokenId || data.token_id || null });
  } catch (err: any) {
    console.log("[POAP][CLAIM] Exception:", err);
    res.status(500).json({ error: err.message });
  }
}