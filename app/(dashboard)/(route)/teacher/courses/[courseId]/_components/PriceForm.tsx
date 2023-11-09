"use client"
 
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Pencil } from "lucide-react"
import axios from 'axios'
import toast from "react-hot-toast"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect, useRouter } from "next/navigation"
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'

interface PriceFormProps{
    initialData:Course,
    courseId:string
}
const formSchema=z.object({
    price:z.coerce.number()
})


const PriceForm = ({initialData,courseId}:PriceFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(true)
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
          price:initialData?.price || undefined
        },
    })

    const toggleEdit=()=>{
        setEditing(!editing)
    }
    const{ isSubmitting,isValid}=form.formState

    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {
                await axios.patch(`/api/courses/${courseId}`,values)
                toast.success("Course Updated Successfully")
                toggleEdit()
                router.refresh()
            

        } catch (error) {
           
            toast.error("Something Went Wrong")
            
        }
        
      }

  return (
   <div className='mt-6 border bg-slate-200 p-4 rounded-md  '>
       <div className="flex items-center justify-evenly flex-wrap">
        Course Price
    {editing?
        <Button variant='ghost' onClick={toggleEdit}>
            <Pencil className="h-4 w-4 mr-2"/> Edit Price
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }

    

       </div>
       {editing ? <p className={cn("text-sm mt-2", !initialData.price && "text-slate-600 italic")}>{initialData.price?.toLocaleString('en-US',{style:'currency',currency:'USD'}) || "no price"}</p>:(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' placeholder="Set a price for your course." {...field}  disabled={isSubmitting}/>
              </FormControl>
              <FormDescription>
                This is for editing the description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
      </form>
    </Form>
  )}
    </div>
  )
  
}

export default PriceForm