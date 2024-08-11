"use client"

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { SizeStock } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SizeStockModalProps{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  initialData: SizeStock | null;
}



export const SizeStockModal: React.FC<SizeStockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if(!isMounted) {
    return null;
  }


  return(
    <Modal
      title="Update stock"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full justify-between">
        <div>
          <Input />
        </div>
        <div>
        <Input required/>
        </div>
      </div>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}