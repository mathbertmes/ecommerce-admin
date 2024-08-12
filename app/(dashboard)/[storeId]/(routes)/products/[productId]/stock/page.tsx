
import { SizeStockModal } from "@/components/modals/update-size-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { useState } from "react";
import SizeStockClient from "./components/client";

const ProductStockPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const stock = await prismadb.sizeStock.findMany({
    where: {
      productId : params.productId,
    },
    include: {
      orderItems : true
    }
  });

  return (
      <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between'>
            <Heading
              title={`stock`}
              description='Manage your product`s stock'
            />
          </div>
          <Separator />
          <SizeStockClient data={stock}/>
        </div>
      </div>
  );
};

export default ProductStockPage;
