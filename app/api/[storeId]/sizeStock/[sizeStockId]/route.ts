import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, sizeStockId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { value, amount } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!value) {
      return new NextResponse("Size value is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount id is required", { status: 400 });
    }

    if (!params.sizeStockId) {
      return new NextResponse("Size stock id is required", { status: 400 });
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

    const sizeStock = await prismadb.sizeStock.updateMany({
      where: {
        id: params.sizeStockId
      },
      data: {
        value,
        amount
      }
    });
  
    return NextResponse.json(sizeStock);
  } catch (error) {
    console.log('[SIZESTOCK_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, sizeStockId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeStockId) {
      return new NextResponse("Size stock id is required", { status: 400 });
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

    const subCategory = await prismadb.sizeStock.deleteMany({
      where: {
        id: params.sizeStockId,
      }
    });
  
    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('[SIZESTOCK_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};