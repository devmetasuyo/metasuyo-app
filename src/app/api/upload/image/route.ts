import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("imagen") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se ha subido ninguna imagen" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    // Procesar la imagen con Sharp
    const imagenProcesada = await sharp(Buffer.from(buffer))
      .resize(300, 400) // Redimensionar a 300x300 píxeles
      .webp() // Convertir a formato WebP
      .toBuffer();

    // Crear una respuesta con la imagen procesada
    const response = new NextResponse(imagenProcesada);

    // Establecer los encabezados de la respuesta
    response.headers.set("Content-Type", "image/webp");
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="imagen_procesada.webp"'
    );

    return response;
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return NextResponse.json(
      { error: "Error al procesar la imagen" },
      { status: 500 }
    );
  }
}
