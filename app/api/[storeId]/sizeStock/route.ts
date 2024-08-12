import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }

){
  try {
    const { userId } = auth()
    const body = await req.json()

    const { value, amount, productId } = body

    if(!userId){
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!value){
      return new NextResponse("Value is required", {status : 400})
    }

    if(!amount){
      return new NextResponse("Amount is required", {status : 400})
    }

    if(!productId){
      return new NextResponse("Product Id is required", {status : 400})
    }

    if(!params.storeId){
      return new NextResponse("Store ID is required", {status : 400})
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId){
      return new NextResponse("Unauthorized", {status : 403})
    }

    const sizeStock = await prismadb.sizeStock.create({
      data: { 
        value,
        amount,
        productId
      }
    })

    return NextResponse.json(sizeStock)

  } catch(error) {
    console.log("[SIZESTOCK_POST]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}