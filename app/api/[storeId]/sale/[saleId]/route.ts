import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, saleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, description, imageUrl, active } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.saleId) {
      return new NextResponse("Sub category id is required", { status: 400 });
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

    const sale = await prismadb.sale.updateMany({
      where: {
        id: params.saleId
      },
      data: {
        name,
        description,
        imageUrl,
        active
      }
    });
  
    return NextResponse.json(sale);
  } catch (error) {
    console.log('[SALE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};