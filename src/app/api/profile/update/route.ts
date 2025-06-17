import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      wallet,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      tipo_documento,
      documento
    } = data;

    if (!wallet) {
      return NextResponse.json({
        status: "error",
        message: "Wallet es requerido"
      }, { status: 400 });
    }

    // Buscar cliente por wallet
    const cliente = await prisma.clientes.findFirst({
      where: { wallet }
    });

    if (!cliente) {
      return NextResponse.json({
        status: "error",
        message: "Cliente no encontrado"
      }, { status: 404 });
    }

    // Actualizar cliente
    const clienteActualizado = await prisma.clientes.update({
      where: { id: cliente.id },
      data: {
        nombre,
        apellido,
        correo,
        telefono,
        direccion,
        tipo_documento,
        documento,
        actualizado_el: new Date()
      }
    });

    return NextResponse.json({
      status: "success",
      message: "Perfil actualizado correctamente",
      cliente: clienteActualizado
    });

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json({
      status: "error",
      message: "Error al actualizar el perfil"
    }, { status: 500 });
  }
} 