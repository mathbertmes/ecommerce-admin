import { format } from "date-fns"

import prismadb from "@/lib/prismadb";
import { SaleClient } from "./components/client";

const BrandsPage = async ({
  params
}: {
  params: { storeId : string }
}) => {
  const sale = await prismadb.sale.findFirst({
    where: {
      storeId: params.storeId
    }
  })


  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SaleClient data={sale}/>
      </div>
    </div>
  )
}

export default BrandsPage;