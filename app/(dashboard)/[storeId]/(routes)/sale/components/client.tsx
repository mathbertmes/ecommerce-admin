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

interface SaleClientProps{
  data: {
    id: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    active: boolean,
  } | null
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
            <Button >
            Desative
          </Button>
          )}
          
          <Button onClick={() => router.push(`/${params.storeId}/brands/new`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Edit
          </Button>
        </div>
      </div>
      <Separator />
      <div className="rounded-md border">
      <Table>
          <TableHeader>
              <TableRow>             
               
                    <TableHead>
                      Name
                    </TableHead>
                    <TableHead>
                      Description
                    </TableHead>
                  
              
              </TableRow>
           
          </TableHeader>
          <TableBody>
                <TableRow
                >
                  
                    <TableCell >
                     {data?.name}
                    </TableCell>
                    <TableCell >
                     {data?.description}
                    </TableCell>
                    
               
                </TableRow>
              
            
          </TableBody>
        </Table>
        </div>
      
    </>
  )
}