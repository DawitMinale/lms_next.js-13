"use client"
 
import React from 'react'

import * as z from "zod"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react"
import axios from 'axios'
import toast from "react-hot-toast"
import {  useRouter } from "next/navigation"
import {  Attachment, Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

interface AttachmentFormProps{
    initialData:Course & {attachments:Attachment[]},
    courseId:string
}
const formSchema=z.object({
    url:z.string().min(1)
})


const AttachmentForm = ({initialData,courseId}:AttachmentFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(false)
    const [deletingId,setDeletingId]=useState<string | null>(null)
    


    const toggleEdit=()=>{
        setEditing(!editing)
    }


    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {
                await axios.post(`/api/courses/${courseId}/attachments`,values)
                toast.success("Course Updated Successfully")
                toggleEdit()
                router.refresh()
            

        } catch (error) {
           
            toast.error("Something Went Wrong")
            
        }
        
      }
 const onDelete=async (id:string)=>{
          try {
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("attachment Deleted")
            router.refresh()
            
          } catch (error){
            console.log(error);
            
            toast.error("Something went wrong")
          } finally{
            setDeletingId(null)
          }

 }
  return (
   <div className='mt-6 border bg-slate-200 p-4 rounded-md'>
       <div className="flex items-center justify-evenly flex-wrap">
        Course Attachments 
    {!editing?
        <Button variant='ghost' onClick={toggleEdit}>
           <><PlusCircle className='h-4 w-4 mr-2'/> Add a file </> 
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }
       </div>
        {!editing && <>
        { initialData.attachments.length===0 &&(
          <p className='text-sm mt-2 text-slate-500 italic'>
            No Attachments yet
          </p>
        )}
        {initialData.attachments.length>0 && (
          <div className="space-y-2">
            {initialData.attachments.map((attachment)=>{
              return <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md'>
                <File className='h-4 w04 mr-3 flex-shrink-0'/>
                <p className="text-xs line-clamp-1">{attachment.name}</p>
                {deletingId===attachment.id &&(
                  <div>
                    <Loader2 className='h-4 w-4 animate-spin'/>
                  </div>
                )}
                 {deletingId!==attachment.id &&(
                  <button className='ml-auto hover:opacity-75 transition' onClick={()=>onDelete(attachment.id)}>
                    <X className='h-4 w-4 '/>
                  </button>
                )}
              </div>
            })}
          </div>
        )}
        </>}
{ editing &&
       <div>
        <FileUpload endpoint='courseAttachment' onChange={(url)=>{
          if(url){
            onSubmit({url})
          }
        }}/>

        <div className="text-sm text-muted-foreground mt-4">
          Add any thing your student might need to complete the course.
        </div>
       </div>
}
    </div>
  
      
  
)}


export default AttachmentForm