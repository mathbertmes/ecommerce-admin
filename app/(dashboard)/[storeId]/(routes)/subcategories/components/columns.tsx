"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";


export type SubCategoryColumn = {
  id: string;
  name: string;
  categoryName: string;
  createdAt: string;
}

export const columns: ColumnDef<SubCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryName",
    header: "Primary Category",
    cell: ({ row }) => row.original.categoryName
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
