import Stripe from "stripe"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"
import { url } from "inspector"
import { Product, SizeStock } from "@prisma/client"

const corsHeaders = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers" : "Content-Type, Authorization",
}

//The store and dashboard have different origins, so we need to send options first!
//Otherwise CORS will block the request
export async function OPTIONS(){
  return NextResponse.json({}, { headers: corsHeaders})
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
){
  const { productIds, sizeStockIds } = await req.json();

  if(!productIds || productIds.length === 0){
    return new NextResponse("Product ids are required", { status: 400 })
  }

  const productsForSize = await prismadb.sizeStock.findMany({
    where: {
      id: {
        in: sizeStockIds
      },
    },
    include: {
      product : true
    }
  })

  productsForSize.forEach(product => {
    product.product
  })

  // const products = await prismadb.product.findMany({
  //   where: {
  //     id: {
  //       in: productIds
  //     },
  //     stock: {
  //       some:{
  //         id: {
  //           in: sizeStockIds
  //         }
  //       }
  //     }
  //   }
  // })

  productsForSize.forEach((product) => {
    if(product.amount < 1){
      return new NextResponse("Product out of stock", { status: 400 })
    }
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  productsForSize.forEach((size) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data : {
          name: size.product.name
        },
        unit_amount: size.product.discountPrice ? size.product.discountPrice.toNumber() * 100 : size.product.price.toNumber() * 100
      }
    })
  })

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems : {
        create: productsForSize.map((product) => ({
          sizeStock: {
            connect: {
              id: product.id,
            }
          },
          itemPrice: product.product.discountPrice ? product.product.discountPrice : product.product.price
        }))
      }
    }
  })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,    
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    }
  })

  return NextResponse.json({ url : session.url }, {
    headers: corsHeaders
  })
}