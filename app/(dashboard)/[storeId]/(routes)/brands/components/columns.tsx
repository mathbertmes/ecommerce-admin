"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import { Product } from "@prisma/client";


export type BrandColumn = {
  id: string;
  name: string;
  productsAmount: Number;
  createdAt: string;
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "productsAmount",
    header: "Products Amount",
    cell: ({ row }) => row.original.productsAmount
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
