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
import { Checkbox } from '@/components/ui/checkbox'


interface ChapterAccessFormProps{
    initialData:Chapter,
    courseId:string
    chapterId:string
}
const formSchema=z.object({
    isFree:z.boolean().default(false)
})


const ChapterAccessForm = ({initialData,courseId,chapterId}:ChapterAccessFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(false)
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
          isFree:!!initialData.isFree
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
        Chapter access setting
    {!editing?
        <Button variant='ghost' onClick={toggleEdit}>
            <Pencil className="h-4 w-4 mr-2"/> chapter access
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }

    

       </div>
       {!editing ? <div className={cn("text-sm mt-2", !initialData.isFree && "text-slate-600 italic")}>
        {initialData.isFree ?(
          <>
          This chapter is free for preview
          </>):(
          <>
          This chapter is not free
          </>
          )
          }
       </div>:(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  Check This box if you want to make this chapter free for preview
                </FormDescription>
              </div>
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

export default ChapterAccessForm