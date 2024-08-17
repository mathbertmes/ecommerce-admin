
import { SizeStockModal } from "@/components/modals/update-size-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns"
import { useState } from "react";
import SizeStockClient from "./components/client";
import { SizeStockColumn } from "./components/columns";

const ProductStockPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },

  });

  const stock = await prismadb.sizeStock.findMany({
    where: {
      productId : params.productId,
    },
    include: {
      orderItems : true
    }
  });

  const formattedSizeStocks: SizeStockColumn[] = stock.map((item) => ({
    id: item.id,
    value: item.value,
    amount: item.amount,
    orders: item.orderItems,

  }))
  return (
    <>
    {!product ? (
      <div>
        <h1>Product not found</h1>
      </div>
    ): (
      
      <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeStockClient product={product} data={formattedSizeStocks}/>
      </div>
      </div>
    )}
      
    </>
  );
};

export default ProductStockPage;
