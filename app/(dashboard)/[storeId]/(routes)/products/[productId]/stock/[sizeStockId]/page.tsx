import prismadb from "@/lib/prismadb";
import { SizeStockForm } from "./components/sizeStock-form";


const sizeStockPage = async ({
  params,
}: {
  params: { sizeStockId: string,productId: string; storeId: string };
}) => {
  const sizeStock = await prismadb.sizeStock.findUnique({
    where: {
      id: params.sizeStockId,
    }
  })

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeStockForm initialData={sizeStock}/>
      </div>
    </div>
  )
}

export default sizeStockPage;