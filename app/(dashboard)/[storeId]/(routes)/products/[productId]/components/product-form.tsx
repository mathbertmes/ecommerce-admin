"use client"

import * as z from "zod";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Brand, Category, Image, Product, SubCategory } from "@prisma/client"
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import prismadb from "@/lib/prismadb";
import { getSubCategories } from "@/actions/get-subCategories";

interface ProductFormPorps{
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  brands: Brand[];
  storeId: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.object({ url: z.string() }).array().min(1, "Images must contain at least 1 image"),
  price: z.coerce.number().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.object({
    value: z.string().min(1, "Size is required"),
    amount: z.coerce.number().min(1, "Amount is required"),
  }).array().min(1, "Stock must contain at least 1 size"),
  subCategoryId: z.string().optional().or(z.null().optional()),
  brandId: z.string().optional().or(z.null().optional()),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
  
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormPorps> = ({
  initialData,
  categories,
  brands
}) => {
  const [stateCategoryId, setStateCategoryId] = useState(initialData?.categoryId)
  const [subCategoriesAvaliable, setSubCategoriesAvailable] = useState<SubCategory[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price))
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      stock: [],
      subCategoryId: '',
      brandId: '',
      isFeatured: false,
      isArchived: false,
    }
  })
  
  const onSubmit = async (data: ProductFormValues) => {
    try{
      if(data.brandId === '' || ' '){
        data.brandId = null
      }
      if(data.subCategoryId === '' || ' '){
        data.subCategoryId = null
      }
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      }else{
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.push(`/${params.storeId}/products`)
      toast.success("Product deleted.")
    } catch(error){
      toast.error("Something went wrong")
    } finally{
      setLoading(false)
      setOpen(false)
    }
  }

  useEffect(() => {
    if(initialData){
      handleCategoryChange(initialData.categoryId)
    }
  }, [])

  const handleCategoryChange = async (paramCategoryId: string) => {
    try {
      const response = await axios.get(`/api/${params.storeId}/categories/${paramCategoryId}/subcategories`)
      setSubCategoriesAvailable(response.data);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stock"
  });


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
        <FormField 
              control={form.control} 
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) => field.onChange([...field.value, { url }])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1 space-y-8">
            <FormField 
              control={form.control} 
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control} 
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
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
                  <FormLabel>Category</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
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
            
            <FormField 
              control={form.control} 
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                    <Select 
                      disabled={loading} 
                      onValueChange={field.onChange} 
                      value={field.value ? field.value : ''} 
                      defaultValue={field.value ? field.value : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            defaultValue={field.value ? field.value : ''}
                            placeholder="Select a sub category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value={' '}
                        >
                          None
                        </SelectItem>
                        {subCategoriesAvaliable.map((individualSubCategory) => (
                          <SelectItem
                            key={individualSubCategory.id}
                            value={individualSubCategory.id}
                          >
                            {individualSubCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="col-span-1 space-y-8">
            <FormField 
              control={form.control} 
              name="brandId"             
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value ? field.value : ''} 
                    defaultValue={field.value ? field.value : ''}
                        
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          defaultValue={field.value ? field.value : ' '}
                          placeholder="Select a brand"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem
                          value={' '}
                        >
                          None
                        </SelectItem>
                      {brands.map((brand) => (
                        <SelectItem
                          key={brand.id}
                          value={brand.id}
                        >
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control} 
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control} 
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            </div>
            <div className="col-span-1 space-y-8">
            <FormField
                control={form.control}
                name="stock"
                render={() => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex space-x-4 items-center">
                        <FormControl>
                          <div>
                          
                          <Input
                            placeholder="Size"
                            {...form.register(`stock.${index}.value` as const, { required: "Size is required" })}
                            defaultValue={field.value}
                          />
                          <FormMessage>{form.formState.errors.stock?.[index]?.value?.message}</FormMessage>
                          </div>
                        </FormControl>
                        <FormControl>
                          <div>
                          <Input
                            type="number"
                            placeholder="Amount"
                            {...form.register(`stock.${index}.amount` as const, { valueAsNumber: true, required: "Amount is required" })}
                            defaultValue={field.amount}
                          />
                          <FormMessage>{form.formState.errors.stock?.[index]?.amount?.message}</FormMessage>
                          </div>
                        </FormControl>
                        <Button className="p-4" type="button" variant="destructive" onClick={() => remove(index)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button className="flex" type="button" onClick={() => append({ value: "", amount: 0 })} variant="outline" size="sm">
                      Add Stock
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
   
    </>
  )
}