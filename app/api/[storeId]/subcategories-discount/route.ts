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

    const subcategories = await prismadb.subCategory.findMany({
      where: {
          products: {
              some: {
                  discount: true,
                  isArchived: false,
              }
          }
      }
  });

    return NextResponse.json(subcategories)

  } catch(error) {
    console.log("[SUBCATEGORIES-DISCOUNT_GET]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}