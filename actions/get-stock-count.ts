import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  const stockCount = await prismadb.product.findMany({ 
    where: {
      storeId,
      isArchived: false
    },
    include: {
      stock : true
    }
  })

  const test = stockCount.map((product) => {
    let itemStock = product.stock.reduce((stockSum, item) => {
      return stockSum + item.amount
    }, 0)
    return itemStock
  })

  const finalStock = test.reduce((sum, itemStock) => {
    return sum + itemStock
  }, 0)

  return finalStock;
}