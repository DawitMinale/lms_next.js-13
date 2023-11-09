"use client"
 
import React from 'react'

import * as z from "zod"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import axios from 'axios'
import toast from "react-hot-toast"
import {  useRouter } from "next/navigation"
import { Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

interface ImageFormProps{
    initialData:Course,
    courseId:string
}
const formSchema=z.object({
    imageUrl:z.string().min(3,{
        message:"Image Url is required"
    })
})


const ImageForm = ({initialData,courseId}:ImageFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(false)
    


    const toggleEdit=()=>{
        setEditing(!editing)
    }


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
   <div className='mt-6 border bg-slate-200 p-4 rounded-md'>
       <div className="flex items-center justify-evenly flex-wrap">
        Course Image 
    {!editing?
        <Button variant='ghost' onClick={toggleEdit}>
           { !initialData.imageUrl?<><PlusCircle className='h-4 w-4 mr-2'/> Upload Image </>:<><Pencil className="h-4 w-4 mr-2"/> Edit Image</> }
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }
       </div>
        {!editing && (
          !initialData.imageUrl ? (
            <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                  <ImageIcon className='h-10 w-10 text-slate-500'/>
              </div>
            
          ):(
            <div className='relative aspect-video mt-2'>
              <Image alt='upload' fill className='object-cover rounded-md' src={initialData.imageUrl}/>
            </div>
          )
        )}
{ editing &&
       <div>
        <FileUpload endpoint='courseImage' onChange={(url)=>{
          if(url){
            onSubmit({imageUrl:url})
          }
        }}/>

        <div className="text-sm text-muted-foreground mt-4">
          16:9 aspect ratio recommended
        </div>
       </div>
}
    </div>
  
      
  
)}


export default ImageForm