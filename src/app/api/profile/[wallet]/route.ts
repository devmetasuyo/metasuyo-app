import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: { wallet: string } }) {
    const wallet = params.wallet
      
     const cliente = await prisma.clientes.findFirst({
        where: { 
            wallet
         }
      });
  
    return NextResponse.json({
        status:"success",
        cliente
    })
}