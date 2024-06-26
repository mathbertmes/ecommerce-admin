"use client"

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Category, SubCategory } from "@prisma/client"
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

interface SubCategoryFormProps{
  initialData: SubCategory | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1)
})

type SubCategoryFormValues = z.infer<typeof formSchema>

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialData,
  categories
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit sub category' : 'Create sub category';
  const description = initialData ? 'Edit a sub category' : 'Create a new sub category';
  const toastMessage = initialData ? 'Sub category updated.' : 'Sub category created.';
  const action = initialData ? 'Save changes' : 'Create';

  
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: ''
    }
  })
  
  const onSubmit = async (data: SubCategoryFormValues) => {
    try{
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/subcategories/${params.subcategoryId}`, data).then(() => router.push(`/${params.storeId}/subcategories`))
      }else{
        await axios.post(`/api/${params.storeId}/subcategories`, data).then(() => router.push(`/${params.storeId}/subcategories`))
      }
      
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
      await axios.delete(`/api/${params.storeId}/subcategories/${params.subcategoryId}`)
      router.push(`/${params.storeId}/categories`)
      toast.success("Sub category deleted.")
    } catch(error){
      toast.error("Make sure you removed all products using this sub category first.")
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub category label" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control} 
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Category</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

