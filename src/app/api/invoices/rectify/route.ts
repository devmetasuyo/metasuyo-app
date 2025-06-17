import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";
import { SUNATValidator } from "@/utils/sunatValidation";

const RUC = process.env.SUNAT_RUC!;

const sunatConfig = {
  rucEmisor: RUC,
  claveSol: process.env.CLAVE_SOL!,
  clientId: process.env.CLIENT_SOL!,
  usuarioSol: process.env.USUARIO_SOL!,
  razonSocialEmisor: process.env.SUNAT_RAZON_SOCIAL!,
  certificadoDigital: process.env.SUNAT_CERTIFICADO!,
  clavePrivada: process.env.SUNAT_CLAVE_PRIVADA!,
  moneda: "PEM",
};

export async function POST(request: NextRequest) {
  try {
    // Obtener todas las facturas
    const facturas = await prisma.facturas.findMany({
      include: {
        clientes: true,
        productos: {
          include: {
            productos: true,
          },
        },
        sunat_en_factura: true,
      },
    });

    const validator = new SUNATValidator(sunatConfig);
    const results = [];

    for (const factura of facturas) {
      try {
        const serie = "F001";
        const correlativoNum = Math.max(
          21,
          Math.min(28, parseInt(factura.id.slice(-8)) || 21)
        );
        const correlativo = correlativoNum.toString().padStart(8, "0");

        const facturaData = {
          serie,
          correlativo,
          fechaEmision: factura.fecha || new Date(),
          cliente: {
            tipoDocumento:
              factura.clientes?.tipo_documento === "RUC" ? "6" : "1",
            numeroDocumento: factura.clientes?.documento || "00000000",
            razonSocial:
              `${factura.clientes?.nombre || ""} ${factura.clientes?.apellido || ""}`.trim(),
            direccion:
              factura.clientes?.direccion || "DIRECCION NO ESPECIFICADA",
          },
          productos: factura.productos.map((item) => ({
            codigo: item.producto_id,
            descripcion: item.productos?.nombre || "Producto sin nombre",
            cantidad: item.cantidad,
            precioUnitario: Number(item.productos?.precio || 0),
            subtotal: Number(item.sub_total),
            igv: Number(item.sub_total) * 0.18,
          })),
          totalVenta: Number(factura.total),
          totalIGV: Number(factura.total) * 0.18,
        };

        const validationResult = await validator.validarComprobante({
          ...facturaData,
          moneda: "PEN",
        });

        results.push({
          facturaId: factura.id,
          clienteId: factura.cliente_id,
          estado: factura.estado,
          estado_sunat: factura.sunat_en_factura?.estado_sunat,
          isValid: validationResult.isValid,
          errors: validationResult.errors || [],
          details: {
            serie: serie,
            correlativo: correlativo,
            totalVenta: facturaData.totalVenta,
            totalIGV: facturaData.totalIGV,
          },
        });
      } catch (error) {
        results.push({
          facturaId: factura.id,
          clienteId: factura.cliente_id,
          estado: factura.estado,
          estado_sunat: factura.sunat_en_factura?.estado_sunat,
          isValid: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    // Agrupar resultados
    const summary = {
      total: results.length,
      validas: results.filter((r) => r.isValid).length,
      invalidas: results.filter((r) => !r.isValid).length,
      detalles: results,
    };

    return NextResponse.json({
      status: "success",
      message: "Proceso de validación completado",
      summary,
    });
  } catch (error) {
    console.error("Error en validación:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error en el proceso de validación",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
