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

    const {
      name,
      price,
      categoryId,
      images,
      subCategoryId,
      brandId,
      stock,
      isFeatured,
      isArchived,
    } = body

    if(!userId){
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
      return new NextResponse("Name is required", {status : 400})
    }

    if(!images || !images.length){
      return new NextResponse("Images are required", {status : 400})
    }

    if(!stock || !stock.length){
      return new NextResponse("Stock is required", {status : 400})
    }

    if(!price){
      return new NextResponse("Price is required", {status : 400})
    }

    if(!categoryId){
      return new NextResponse("Category id is required", {status : 400})
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

    const product = await prismadb.product.create({
      data: { 
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        storeId: params.storeId,
        subCategoryId,
        brandId,
        stock : {
          createMany: {
            data: [
              ...stock.map((sizeStock: { value: string, amount: number }) => sizeStock)
            ]
          }
        },
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product)

  } catch(error) {
    console.log("[PRODUCTS_POST]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }

){
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined;
    const subcategoryId = searchParams.get("subcategoryId") || undefined;
    const brandId = searchParams.get("brandId") || undefined;
    const discount = searchParams.get("discount");
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured")
    if(!params.storeId){
      return new NextResponse("Store ID is required", {status : 400})
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        brandId,
        subCategoryId: subcategoryId,
        discount: discount ? true : undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include : {
        images: true,
        category: true,
        stock: true
      },
      orderBy:{
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch(error) {
    console.log("[PRODUCTS_GET]", error)
    return new NextResponse("Internal Error", {status : 500})
  }
}