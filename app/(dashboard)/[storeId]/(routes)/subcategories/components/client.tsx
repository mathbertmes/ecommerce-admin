"use client"

import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { SubCategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface CategoryClientProps{
  data: SubCategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return(
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Sub Categories (${data.length})`}
          description="Manage sub categories for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/subcategories/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data}/>
      <Heading 
        title="API"
        description="API calls for categories"
      />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
  )
}