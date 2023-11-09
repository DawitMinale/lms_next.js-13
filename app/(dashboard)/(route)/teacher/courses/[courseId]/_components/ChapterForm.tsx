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
import { Loader2, Pencil, PlusCircle } from "lucide-react"
import axios from 'axios'
import toast from "react-hot-toast"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect, useRouter } from "next/navigation"
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Chapter, Course } from '@prisma/client'
import ChaptersList from './ChaptersList'

interface ChapterFormProps{
    initialData:Course & {chapters:Chapter[]},
    courseId:string
}
const formSchema=z.object({
    title:z.string().min(3,)
})


const ChapterForm = ({initialData,courseId}:ChapterFormProps) => {
    const router=useRouter()
    const [creating,setCreating]=useState(false)
    const [updating,setUpdating]=useState(false)
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
          title:""
        },
    })

    const toggleCreate=()=>{
        setCreating(!creating)
    }
    const{ isSubmitting,isValid}=form.formState

    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {
                await axios.post(`/api/courses/${courseId}/chapters`,values)
                toast.success("Chapter Created")
                toggleCreate()
                router.refresh()
            

        } catch (error) {
           
            toast.error("Something Went Wrong")
            
        }
        
      }
      const onReorder=async (updateData:{id:string,position:number}[])=>{
        try {
          setUpdating(true)
          await axios.put(`/api/courses/${courseId}/reorder`,{
            list:updateData
          })

          toast.success("chapters reordered")
          router.refresh()
          
        } catch (error) {
          toast.error("Something went wrong")
          
        }finally{
          setUpdating(false)
        }
      }

      const onEdit=(id:string)=>{
        router.push(`/teacher/courses/${courseId}/chapter/${id}`)
      }

  return (
   <div className='mt-6 border relative bg-slate-200 p-4 rounded-md  '>
      {updating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex justify-center items-center'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700'/>
        </div>
      )}
       <div className="flex items-center justify-evenly flex-wrap">
        Course  Chapter
    {!creating?
        <Button variant='ghost' onClick={toggleCreate}>
            <PlusCircle className="h-4 w-4 mr-2"/> Add Chapter
        </Button>:
        <Button variant='ghost'  onClick={toggleCreate}>
            Cancel
        </Button>
    }

    

       </div>
   {creating &&
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>title</FormLabel>
              <FormControl>
                <Input placeholder="eg Introduction to this course " {...field}  disabled={isSubmitting}/>
              </FormControl>
              <FormDescription>
                This is for adding the chapter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !isValid}>Create</Button>
      </form>
    </Form>
  }
      {!creating &&(
        <p className='text-sm'>drag and drop to change the position</p>
      )}

      {!creating &&(
        <div className={cn("text-sm mt-3",!initialData.chapters.length && "text-slate-500 italic")}>
          {!initialData.chapters.length && "No Chapter"}
          <ChaptersList onEdit={onEdit} onReorder={onReorder} items={initialData.chapters || []}/>
        </div>
      )}
    </div>
  )
  
}

export default ChapterForm