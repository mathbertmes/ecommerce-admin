"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { OrderItem } from "@prisma/client";


export type SizeStockColumn = {
  id: string;
  value: string;
  amount: number;
  orderItems: OrderItem[]
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
  accessorKey: "orderItems",
    header: "Orders",
    cell: ({ row }) => row.original.orderItems.length
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
