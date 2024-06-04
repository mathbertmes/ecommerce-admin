"use client"

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Sale } from "@prisma/client"
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface SaleFormPorps{
  initialData: Sale | null
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  active: z.boolean()
})

type SaleFormValues = z.infer<typeof formSchema>

export const SaleForm: React.FC<SaleFormPorps> = ({
  initialData
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      imageUrl: '',
      active: false
    }
  })

  const onSubmit = async (data: SaleFormValues) => {
    try{
      setLoading(true)
      await axios.patch(`/api/${params.storeId}/sale/${initialData?.id}`, data)
      router.refresh()
      toast.success("Store updated")
    }catch (error){
      console.log(error)
      toast.error("Something went wrong")
    }finally{
      setLoading(false)
    }
  }

  return(
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => {}}
      loading={loading}
    />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField 
              control={form.control} 
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control} 
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sale name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control} 
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input value={field.value ? field.value : " "} onChange={field.onChange} disabled={loading} placeholder="Sale name"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
                control={form.control} 
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <FormDescription>
                        When activated willl generate a sale page with all products with discount
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
     
    </>
  )
}