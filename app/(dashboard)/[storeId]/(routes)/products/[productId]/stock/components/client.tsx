"use client";

import { SizeStockModal } from "@/components/modals/update-size-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Product, SizeStock } from "@prisma/client";
import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { columns, SizeStockColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface SizeStockClientProps {
  data: SizeStockColumn[];
  product: Product | null;
}

const SizeStockClient: React.FC<SizeStockClientProps> = ({ data, product }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
      <Heading 
        title={`Categories (${data.length})`}
        description="Manage categories for your store"
      />
      <Button onClick={() => router.push(`/${params.storeId}/products/${params.productId}/stock/new`)}>
        <Plus className="mr-2 h-4 w-4"/>
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable searchKey="value" columns={columns} data={data}/>
  </>
      // <>
      //   <div className='flex items-center justify-between'>
      //       <Heading
      //         title={`${product?.name} stock`}
      //         description='Manage your product`s stock'
      //       />
      //       <Button
      //       variant='default'
      //       onClick={() => router.push(`/${params.storeId}/products/${params.productId}/stock/new`)}
      //       className='bg-green-600'
      //     >
      //       Create new size
      //     </Button>
      //     </div>
      //     <Separator />
      //   <div>
      //     {data?.length ? (
      //       <>
      //       <div className="flex gap-10">
      //         {data?.map((item) => (
      //           <div key={item.id}>
      //             <div className="flex gap-5">
      //               <h3>Size {item.value}</h3>
      //               <h3>Amount {item.amount}</h3>
      //             </div>
      //             <div>
      //               <Button onClick={() => router.push(`/${params.storeId}/products/${params.productId}/stock/${item.id}`)}>
      //               <Edit className="h-4 w-4 mr-2"/>
      //               Update
      //               </Button>
      //             </div>
      //           </div>
      //         ))}
      //         </div>
      //       </>
      //     ) : (
      //       <h1>This product doesnt have any stock yet</h1>
      //     )}
      //   </div>
      //   </>
  );
};

export default SizeStockClient;
