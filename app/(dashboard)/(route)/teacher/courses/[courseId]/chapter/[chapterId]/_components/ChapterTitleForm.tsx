"use client"
 
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
import { Course,Chapter } from "@prisma/client"

interface ChapterTitleProps{
    initialData:Chapter
    courseId:string
    chapterId:string
}
const formSchema=z.object({
    title:z.string().min(3)
})

const ChapterTitle = ({initialData,courseId,chapterId}:ChapterTitleProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(true)
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
          title:initialData?.title || ""
        }
    })

    const toggleEdit=()=>{
        setEditing(!editing)
    }
    const{ isSubmitting,isValid}=form.formState

    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
                toast.success("Chapter Updated")
                toggleEdit()
                router.refresh()
            

        } catch (error) {
           
            toast.error("Something Went Wrong")
            
        }
        
      }

  return (
    <div className='mt-6 border bg-slate-200 p-4 rounded-md'>
       <div className="flex items-center justify-evenly">
        Chapter Title 
    {editing?
        <Button variant='ghost' onClick={toggleEdit}>
            <Pencil className="h-4 w-4 mr-2"/> Edit Title
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }

    

       </div>
       {editing ? <p className="text-sm mt-2">{initialData.title}</p>:(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="eg. Introduction to the course " {...field}  disabled={isSubmitting}/>
              </FormControl>
              <FormDescription>
                This is for editing the title
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

export default ChapterTitle
