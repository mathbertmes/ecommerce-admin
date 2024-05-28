"use client"

import { useParams, useRouter } from "next/navigation";
import { Edit, MoreHorizontal } from "lucide-react";


import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SaleCellActionsProps{
  data: {
    id: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    active: boolean,
  } | null
}

export const CellAction: React.FC<SaleCellActionsProps> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return(
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/sale/${data?.id}`)}>
            <Edit className="h-4 w-4 mr-2"/>
            Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}