"use client"

import { Button } from "@/components/ui/button";
import { Product, SizeStock } from "@prisma/client"

interface SizeStockClientProps{
  data : SizeStock[] | null
}

const SizeStockClient: React.FC<SizeStockClientProps> = ({
  data
}) => {
  return(
    <div>
      <div>
            {data?.length ?<h1>ola</h1> : <h1>This product doesnt have any stock yet</h1>}
          </div>
          <div>
            <Button variant="default" className="bg-green-600">
              Create new size
            </Button>
          </div>
    </div>
  )
}

export default SizeStockClient