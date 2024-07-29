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

    const categories = await prismadb.category.findMany({
      where: {
        storeId : params.storeId,
          products: {
              some: {
                  discount: true,
                  isArchived: false,
              }
          }
      },
      include: {
        subCategories: {
          where: {
            storeId : params.storeId,
              products: {
                  some: {
                      discount: true,
                      isArchived: false,
                  }
              }
          }
        }
      }
  });

    return NextResponse.json(categories)

  } catch(error) {
    console.log("[CATEGORIES-DISCOUNT_GET]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}