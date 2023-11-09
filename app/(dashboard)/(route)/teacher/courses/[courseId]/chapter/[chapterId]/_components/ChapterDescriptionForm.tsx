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
import { Chapter, Course } from '@prisma/client'
import { Editor } from '@/components/editor'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Preview } from '@/components/preview'


interface ChapterDescriptionFormProps{
    initialData:Chapter,
    courseId:string
    chapterId:string
}
const formSchema=z.object({
    description:z.string().min(3,{
        message:"description is required"
    })
})


const ChapterDescriptionForm = ({initialData,courseId,chapterId}:ChapterDescriptionFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(false)
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
          description:initialData?.description || ""
        },
    })

    const toggleEdit=()=>{
        setEditing(!editing)
    }
    const{ isSubmitting,isValid}=form.formState

    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
                toast.success("Chapter Updated ")
                toggleEdit()
                router.refresh()
            

        } catch (error) {
           
            toast.error("Something Went Wrong")
            
        }
        
      }

  return (
   <div className='mt-6 border bg-slate-200 p-4 rounded-md  '>
       <div className="flex items-center justify-evenly flex-wrap">
        Chapter description
    {!editing?
        <Button variant='ghost' onClick={toggleEdit}>
            <Pencil className="h-4 w-4 mr-2"/> Edit description
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }

    

       </div>
       {!editing ? <div className={cn("text-sm mt-2", !initialData.description && "text-slate-600 italic")}>
        {!initialData.description && "no description"}
        {initialData.description &&(
          <Preview value={initialData.description}/>
        )}
       </div>:(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Editor {...field}/>
                {/* <SimpleMDE placeholder='Description' className=''  /> */}
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

export default ChapterDescriptionForm