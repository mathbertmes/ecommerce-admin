import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"



export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }

){
  try {

    if(!params.storeId){
      return new NextResponse("Store ID is required", {status : 400})
    }

    const sale = await prismadb.sale.findFirst({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(sale)

  } catch(error) {
    console.log("[SALE_GET]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}