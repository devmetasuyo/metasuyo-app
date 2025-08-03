import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidar la página del Shop
    revalidatePath("/Shop");
    
    return Response.json({ 
      message: "Shop page revalidated successfully",
      status: "success",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[API][revalidate/shop] Error:", error);
    return Response.json(
      { 
        error: "Error revalidating shop page", 
        status: "error" 
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar si el endpoint está funcionando
export async function GET() {
  return Response.json({ 
    message: "Shop revalidation endpoint is working",
    status: "success"
  });
}