"use client"

import { useParams, useRouter } from "next/navigation"
import { Edit, Plus } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { CellAction } from "./cell-action"
import { SaleForm } from "./sale-form"
import { Sale } from "@prisma/client"

interface SaleClientProps{
  data: Sale | null
}



export const SaleClient: React.FC<SaleClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return(
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Sale`}
          description="When activated create a new page where join all discounted products"
        />
        <div className="flex gap-3">
          {data?.active === false ? (
            <>
            <div className="flex items-center gap-2 border-2 py-2 px-4 border-red-600 rounded-3xl">
              <div className="h-3 w-3 rounded-full bg-red-600"></div>
              disabled
            </div>
            <Button >
            Activate
          </Button>
          </>
          ) : (
            <>
            <div className="flex items-center gap-2 border-2 py-2 px-4 border-green-600 rounded-3xl">
              <div className="h-3 w-3 rounded-full bg-green-600"></div>
              Active
            </div>
            <Button >
            Desative
          </Button>
          </>
          )}
          
          <Button onClick={() => router.push(`/${params.storeId}/brands/new`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Edit
          </Button>
        </div>
      </div>
      <Separator />
          <SaleForm initialData={data}/>
      
    </>
  )
}