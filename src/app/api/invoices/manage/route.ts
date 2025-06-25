import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";
import Big from "big.js";
import { getEthPrice } from "@/utils/getEthPrice";

export const POST = async (request: NextRequest) => {
  const data = await request.json();

  const { wallet, id, productosInList } = data;

  if (!wallet)
    return Response.json({
      data: null,
      status: "error",
      message: "Wallet not found",
    });

  const factura = await prisma.$transaction(async (prisma) => {
    const customer = await prisma.clientes.findFirst({
      where: { wallet },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const idProductosEnElCarrito: string[] = productosInList.map(
      (product: { id: string }) => {
        return product.id;
      }
    );

    const productosEnFacturaActual = await prisma.productos_en_factura.findMany(
      {
        where: {
          factura_id: id,
        },
      }
    );

    const productos = await prisma.productos.findMany({
      where: {
        id: {
          in: idProductosEnElCarrito,
        },
      },
    });

    const productosEnFactura: {
      producto_id: string;
      cantidad: number;
      sub_total: number;
    }[] = [];

    const total = productos.reduce((total, producto) => {
      const productoInList = productosInList.find(
        (item: { id: string }) => item.id === producto.id
      );

      if (productoInList.price !== Number(producto.precio)) {
        throw new Error("Precio no coincide");
      }

      if (producto.cantidad - productoInList.quantity <= 0) {
        throw new Error("Cantidad no coincide");
      }

      productosEnFactura.push({
        producto_id: producto.id,
        cantidad: productoInList?.quantity,
        sub_total: Number(productoInList?.quantity) * Number(producto.precio),
      });

      return total + Number(producto.precio) * productoInList?.quantity;
    }, 0);

    const eth = await getEthPrice();

    return await prisma.facturas.upsert({
      where: { id },
      include: {
        productos: true,
      },
      create: {
        id,
        tasa_dollar: eth?.price,
        estado: "pendiente",
        wallet: wallet,
        total: total,
        cliente_id: customer?.id,
        fecha: new Date(),
        productos: {
          createMany: {
            data: productosEnFactura,
          },
        },
      },
      update: {
        total: total,
        productos: {
          createMany: {
            data: productosEnFactura,
          },
          deleteMany: {
            id: {
              in: productosEnFacturaActual.map((item) => item.id),
            },
          },
        },
      },
    });
  });

  return Response.json({ order: factura, status: "success" });
};

export const PUT = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const { hash, id, total } = data;

    console.log("PUT /api/invoices/manage - Datos recibidos:", { hash, id, total });

    if (!id) {
      return Response.json({
        data: null,
        status: "error",
        message: "ID not found",
      });
    }

    // Primero verificar si la factura existe
    const facturaExistente = await prisma.facturas.findUnique({
      where: { id },
      include: { productos: true },
    });

    console.log("Factura encontrada:", facturaExistente ? "SÍ" : "NO");

    if (!facturaExistente) {
      return Response.json({
        data: null,
        status: "error",
        message: `Factura no encontrada con ID: ${id}. Asegúrate de que la orden esté creada antes de marcar el pago.`,
      });
    }

    const factura = await prisma.$transaction(async (prisma) => {
      const productos = await prisma.productos.findMany({
        where: {
          AND: facturaExistente.productos.map((product) => {
            return { id: product.producto_id };
          }),
        },
      });

      const totalVerificado = productos.reduce((total, producto) => {
        const productoInList = facturaExistente.productos.find(
          (item) => item.producto_id === producto.id
        );

        if (!productoInList) {
          throw new Error("Producto no encontrado");
        }
        const totalFix = new Big(Number(producto.precio));
        return total + totalFix.mul(productoInList.cantidad).toNumber();
      }, 0);

      console.log("Total verificado:", totalVerificado, "Total recibido:", total);

      // Verificar si es un pago YAPE (identificado por el prefijo en el hash)
      const isYapePayment = hash && hash.startsWith("YAPE-");
      
      if (isYapePayment) {
        // Para pagos YAPE, comparar directamente en USD
        const totalDecimal = new Big(total);
        if (!totalDecimal.eq(totalVerificado)) {
          throw new Error(`Total no coincide. Recibido: ${total}, Esperado: ${totalVerificado}`);
        }
      } else {
        // Para pagos crypto, convertir de wei a ETH
        const compared = new Big(total / 1000000000000000000);
        if (!compared.eq(totalVerificado)) {
          throw new Error(`Total no coincide. Recibido: ${compared}, Esperado: ${totalVerificado}`);
        }
      }

      const facturaActualizada = await prisma.facturas.update({
        data: {
          estado: "pagado",
          hash: hash,
        },
        include: {
          productos: {
            include: {
              productos: true,
            },
          },
        },
        where: {
          id,
        },
      });

      // Reducir inventario
      for (const item of facturaActualizada.productos) {
        await prisma.productos.update({
          data: {
            cantidad: {
              decrement: item.cantidad,
            },
          },
          where: {
            id: item.producto_id,
          },
        });
      }

      return facturaActualizada;
    });

    return Response.json({ order: factura, status: "success" });
  } catch (error) {
    console.error("Error en PUT /api/invoices/manage:", error);
    return Response.json({
      data: null,
      status: "error",
      message: error instanceof Error ? error.message : "Error interno del servidor",
    });
  }
};