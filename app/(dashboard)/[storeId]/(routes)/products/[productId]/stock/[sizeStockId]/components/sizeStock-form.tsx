"use client"

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Billboard, Category, SizeStock } from "@prisma/client"
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SizeStockFormPorps{
  initialData: SizeStock | null;
}

const formSchema = z.object({
  value: z.string().min(1, "Size is required"),
  amount: z.coerce.number().min(0, "Min 0")
})

type SizeStockFormValues = z.infer<typeof formSchema>

export const SizeStockForm: React.FC<SizeStockFormPorps> = ({
  initialData,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit Size Stock' : 'Create Size Stock';
  const description = initialData ? 'Edit a size stock' : 'Create a new size stock';
  const toastMessage = initialData ? 'Size stock updated.' : 'Size stock created.';
  const action = initialData ? 'Save changes' : 'Create';

  
  const form = useForm<SizeStockFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? 
    {
      value: initialData.value,
      amount: initialData.amount
    } : {
      value: '',
      amount: 0
    }
  })
  
  const onSubmit = async (data: SizeStockFormValues) => {
    try{
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
      }else{
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage)
    }catch (error){
      console.log(error)
      toast.error("Something went wrong")
    }finally{
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try{
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted.")
    } catch(error){
      toast.error("Make sure you removed all products using this category first.")
    } finally{
      setLoading(false)
      setOpen(false)
    }
  }

  return(
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control} 
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField 
              control={form.control} 
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="0" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
   
    </>
  )
}