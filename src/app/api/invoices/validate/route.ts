import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";
import { SunatService } from "@/utils/sunatService";
import { FacturaData, SUNATValidator } from "@/utils/sunatValidation";
import { writeFileSync } from "fs";

import { join } from "path";
const RUC = process.env.SUNAT_RUC!;

const sunatService = new SunatService(
  process.env.SUNATSERVICEUSER!,
  process.env.CLAVE_SOL!
);

const sunatValidator = new SUNATValidator({
  rucEmisor: RUC,
  claveSol: process.env.CLAVE_SOL!,
  clientId: process.env.CLIENT_SOL!,
  usuarioSol: process.env.USUARIO_SOL!,
  razonSocialEmisor: process.env.SUNAT_RAZON_SOCIAL!,
  certificadoDigital: process.env.SUNAT_CERTIFICADO!,
  clavePrivada: process.env.SUNAT_CLAVE_PRIVADA!,
  moneda: "PEM",
});

function generateFileName(
  ruc: string,
  tipoDoc: string,
  serie: string,
  correlativo: string,
  extension?: "xml" | "zip"
) {
  return `${ruc}-${tipoDoc}-${serie}-${correlativo}${extension ? "." + extension : ""}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { invoiceId } = data;

    if (!invoiceId) {
      return NextResponse.json(
        {
          status: "error",
          message: "ID de factura requerido",
        },
        { status: 400 }
      );
    }

    const invoice = await prisma.facturas.findUnique({
      where: { id: invoiceId },
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

    if (!invoice) {
      return NextResponse.json(
        {
          status: "error",
          message: "Factura no encontrada",
        },
        { status: 404 }
      );
    }

    const lastSunatFactura = await prisma.sunat_en_factura.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (invoice.sunat_en_factura?.estado_sunat === "validado") {
      return NextResponse.json(
        {
          status: "error",
          message: "La factura ya ha sido validada por SUNAT",
        },
        { status: 400 }
      );
    }

    const serie = "F001";
    const clienteDocumento = invoice.clientes?.documento;
    const correlativo = lastSunatFactura?.id
      ? (lastSunatFactura.id + 1).toString()
      : "1";

    if (!clienteDocumento)
      throw new Error("El documento del cliente no es válido");

    if (!sunatValidator.validarRUC(clienteDocumento))
      throw new Error("El documento del cliente no es válido");

    if (invoice.clientes?.tipo_documento === "DNI")
      throw new Error(
        "Tiene que configurar tipo de documento RUC en su perfil"
      );

    const facturaData: FacturaData = {
      serie,
      correlativo,
      fechaEmision: invoice.fecha || new Date(),
      cliente: {
        tipoDocumento: invoice.clientes?.tipo_documento === "DNI" ? "1" : "6",
        numeroDocumento: invoice.clientes?.documento || "",
        razonSocial:
          `${invoice.clientes?.nombre || ""} ${invoice.clientes?.apellido || ""}`.trim(),
        direccion: invoice.clientes?.direccion || "DIRECCION NO ESPECIFICADA",
      },
      productos: invoice.productos.map((item) => ({
        codigo: item.producto_id,
        descripcion: item.productos?.nombre || "Producto sin nombre",
        cantidad: item.cantidad,
        precioUnitario:
          (item.productos?.precio?.toNumber() || 0) * +invoice.tasa_dollar,
        subtotal: +item.sub_total * +invoice.tasa_dollar,
        igv: +item.sub_total * +invoice.tasa_dollar * 0.18,
      })),
      totalVenta: +invoice.total * +invoice.tasa_dollar,
      totalIGV: +invoice.total * +invoice.tasa_dollar * 0.18,
      moneda: "USD",
    };

    const pathToSave = join(process.cwd(), "public", "sunat", "invoices");

    sunatValidator.pathToSave = pathToSave;
    sunatValidator.filename = generateFileName(RUC, "01", serie, correlativo);
    sunatValidator.prepararFactura(facturaData);
    await sunatValidator.generarXML(facturaData);

    sunatValidator.firmarXML();

    const response = await sunatService.sendBill({
      name: sunatValidator.filename,
    });

    await prisma.facturas.update({
      where: { id: invoiceId },
      data: {
        sunat_en_factura: {
          create: {
            estado_sunat: "validado",
            serie_sunat: serie,
            ticket_xml: response.cdr,
            xml: response.xml,
          },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Factura validada correctamente por SUNAT",
      details: {
        serie: serie,
        correlativo: correlativo,
        fechaValidacion: new Date().toISOString(),
        montoTotal: facturaData.totalVenta,
        igv: facturaData.totalIGV,
        cdr: response.cdr,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      writeFileSync(
        join(process.cwd(), "public", "sunat", "errors", "error.xml"),
        error.message.replace("Error de SUNAT: ", "")
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Endpoint para consultar el estado de una factura
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.facturas.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        estado: true,
        fecha: true,
        total: true,
        hash: true,
        clientes: {
          select: {
            nombre: true,
            apellido: true,
            tipo_documento: true,
            documento: true,
            direccion: true,
          },
        },
        sunat_en_factura: {
          select: {
            id: true,
            estado_sunat: true,
            serie_sunat: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        {
          status: "error",
          message: "Factura no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      invoice: {
        ...invoice,
        sunat: {
          estado: invoice.sunat_en_factura?.estado_sunat,
          serie: invoice.sunat_en_factura?.serie_sunat,
          correlativo: invoice.sunat_en_factura?.id,
        },
      },
    });
  } catch (error) {
    console.error("Error consultando factura:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al consultar la factura",
      },
      { status: 500 }
    );
  }
}
