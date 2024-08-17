"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { OrderItem } from "@prisma/client";


export type SizeStockColumn = {
  id: string;
  value: string;
  amount: number;
  orders: OrderItem[]
}

export const columns: ColumnDef<SizeStockColumn>[] = [
  {
    accessorKey: "value",
    header: "Size",
  },
  {
    accessorKey: "amount",
    header: "Units"
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
