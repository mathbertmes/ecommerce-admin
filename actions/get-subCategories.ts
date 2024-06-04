import prismadb from "@/lib/prismadb";

export const getSubCategories = async (storeId: string, categoryId: string) => {
  const subCategories = await prismadb.subCategory.findMany({ 
    where: {
      storeId,
      categoryId
    }
  })

  return subCategories;
}
