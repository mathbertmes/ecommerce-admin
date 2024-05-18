import prismadb from "@/lib/prismadb";
import { SubCategoryForm } from "./components/subCategory-form";

const SubCategoryPage = async ({
  params
} : {
  params: {subcategoryId : string, storeId: string }
}) => {
  const subCategory = await prismadb.subCategory.findUnique({
    where: {
      id: params.subcategoryId,
    }
  })

  const categories = await prismadb.category.findMany({
    where:{
      storeId: params.storeId,
    }
  })

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm categories={categories} initialData={subCategory}/>
      </div>
    </div>
  )
}

export default SubCategoryPage;