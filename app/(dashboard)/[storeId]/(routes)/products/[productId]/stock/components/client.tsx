"use client"

import { SizeStockModal } from "@/components/modals/update-size-modal";
import { Button } from "@/components/ui/button";
import { Product, SizeStock } from "@prisma/client"
import { useState } from "react";

interface SizeStockClientProps{
  data : SizeStock[] | null
  product: Product | null
}

const SizeStockClient: React.FC<SizeStockClientProps> = ({
  data,
  product
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalData, setModalData] = useState(null)

  return(
    <>
    <SizeStockModal
      isOpen={modalIsOpen}
      onClose={() => setModalIsOpen(false)}
      initialData={modalData}
    />
      <div>
        <div>
              {data?.length ?<h1>ola</h1> : <h1>This product doesnt have any stock yet</h1>}
            </div>
            <div>
              <Button variant="default" onClick={() => setModalIsOpen(true)} className="bg-green-600">
                Create new size
              </Button>
            </div>
      </div>
    </>
  )
}

export default SizeStockClient