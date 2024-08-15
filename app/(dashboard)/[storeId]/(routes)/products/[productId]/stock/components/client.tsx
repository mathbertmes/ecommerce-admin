"use client";

import { SizeStockModal } from "@/components/modals/update-size-modal";
import { Button } from "@/components/ui/button";
import { Product, SizeStock } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface SizeStockClientProps {
  data: SizeStock[] | null;
  product: Product | null;
}

const SizeStockClient: React.FC<SizeStockClientProps> = ({ data, product }) => {
  const router = useRouter()
  const params = useParams()

  return (

      <div>
        <div>
          {data?.length ? (
            <>
              {data?.map((item) => (
                <div key={item.id}>
                  <div>
                    <h3>Size {item.value}</h3>
                    <h3>Amount {item.amount}</h3>
                  </div>
                  <div>
                    <Button onClick={() => router.push(`/${params.storeId}/products/${params.productId}/stock/${item.id}`)}>
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h1>This product doesnt have any stock yet</h1>
          )}
        </div>
        <div>
          <Button
            variant='default'
            onClick={() => router.push(`/${params.storeId}/products/${params.productId}/stock/new`)}
            className='bg-green-600'
          >
            Create new size
          </Button>
        </div>
      </div>
  );
};

export default SizeStockClient;
