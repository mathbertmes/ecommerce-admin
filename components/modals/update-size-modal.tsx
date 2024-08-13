"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { SizeStock } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

interface SizeStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: SizeStock | null;
}

const sizeStockFormSchema = z.object({
  value: z.string().min(1, "Size is required"),
  amount: z.coerce.number().min(0, "Min 0"),
});

type SizeStockValues = z.infer<typeof sizeStockFormSchema>;

export const SizeStockModal: React.FC<SizeStockModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SizeStockValues>({
    resolver: zodResolver(sizeStockFormSchema),
    defaultValues: initialData
      ? {
          value: initialData.value,
          amount: initialData.amount,
        }
      : {
          value: "",
          amount: 0,
        },
  });

  const onSubmit = async (data: SizeStockValues) => {
    console.log(data);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Update stock'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex w-full justify-between'>
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Size' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Amount' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
            <Button disabled={loading} variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} variant='default' type='submit'>
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
