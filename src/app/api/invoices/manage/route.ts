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
  const data = await request.json();

  const { hash, id, total } = data;

  if (!id)
    return Response.json({
      data: null,
      status: "error",
      message: "ID not found",
    });

  const factura = await prisma.$transaction(async (prisma) => {
    const factura = await prisma.facturas.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });

    if (!factura) {
      throw new Error("Factura no encontrada");
    }

    const productos = await prisma.productos.findMany({
      where: {
        AND: factura.productos.map((product) => {
          return { id: product.producto_id };
        }),
      },
    });

    const totalVerificado = productos.reduce((total, producto) => {
      const productoInList = factura.productos.find(
        (item) => item.producto_id === producto.id
      );

      if (!productoInList) {
        throw new Error("Producto no encontrado");
      }
      const totalFix = new Big(Number(producto.precio));
      return total + totalFix.mul(productoInList.cantidad).toNumber();
    }, 0);

    const compared = new Big(total / 1000000000000000000);

    if (!compared.eq(totalVerificado)) {
      throw new Error("Total no coincide");
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

    if (!facturaActualizada) {
      throw new Error("Factura no encontrada");
    }

    for (const item of facturaActualizada.productos) {
      const producto = await prisma.productos.update({
        data: {
          cantidad: {
            decrement: item.cantidad,
          },
        },
        where: {
          id: item.producto_id,
        },
      });

      console.log(producto);
    }

    return facturaActualizada;
  });

  return Response.json({ order: factura, status: "success" });
};
