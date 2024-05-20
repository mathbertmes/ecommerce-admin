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

    const { name, categoryId } = body

    if(!userId){
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
      return new NextResponse("Name is required", {status : 400})
    }

    if(!categoryId){
      return new NextResponse("Category ID is required", {status : 400})
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

    const subCategory = await prismadb.subCategory.create({
      data: { 
        name,
        categoryId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(subCategory)

  } catch(error) {
    console.log("[SUBCATEGORIES_POST]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string} }

){
  try {

    if(!params.storeId){
      return new NextResponse("Store ID is required", {status : 400})
    }

    if(!params.categoryId){
      return new NextResponse("Category ID is required", {status : 400})
    }

    const subCategories = await prismadb.subCategory.findMany({
      where: {
        storeId: params.storeId,
        categoryId: params.categoryId
      }
    })

    return NextResponse.json(subCategories)

  } catch(error) {
    console.log("[SUBCATEGORIES_GET]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}