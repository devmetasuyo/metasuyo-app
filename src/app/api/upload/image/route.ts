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

    const imagenProcesada = await sharp(Buffer.from(buffer))
      .resize(300, 400)
      .webp()
      .toBuffer();

    const response = new NextResponse(imagenProcesada);

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
