import { prisma } from "@/utils/prismaClient"

export const POST =async (request:Request) => {
    const data = await request.json()

        // const newProduct = await prisma.productos.create({
        //     data:{
        //         descripcion:data.descripcion
                
        //     }
        // })

        return Response.json({message:data})
    }