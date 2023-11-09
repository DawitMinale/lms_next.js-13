"use client"
 
import React from 'react'

import * as z from "zod"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react"
import axios from 'axios'
import toast from "react-hot-toast"
import {  useRouter } from "next/navigation"
import { Chapter, Course, MuxData } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoFormProps{
    initialData:Chapter & {muxData? :MuxData | null},
    courseId:string
    chapterId:string
}
const formSchema=z.object({
    videoUrl:z.string().min(3)
})


const ChapterVideoForm = ({initialData,courseId,chapterId}:ChapterVideoFormProps) => {
    const router=useRouter()
    const [editing,setEditing]=useState(false)
    


    const toggleEdit=()=>{
        setEditing(!editing)
    }


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
       <div className="flex items-center justify-evenly flex-wrap">
        Chapter Video 
    {!editing?
        <Button variant='ghost' onClick={toggleEdit}>
           { !initialData.videoUrl?<><PlusCircle className='h-4 w-4 mr-2'/> Add a Video </>:<><Pencil className="h-4 w-4 mr-2"/> Edit Video</> }
        </Button>:
        <Button variant='ghost'  onClick={toggleEdit}>
            Cancel
        </Button>
    }
       </div>
        {!editing && (
          !initialData.videoUrl ? (
            <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                  <Video className='h-10 w-10 text-slate-500'/>
              </div>
            
          ):(
            <div className='relative aspect-video mt-2'>
              <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
            </div>
          )
        )}
{ editing &&
       <div>
        <FileUpload endpoint='chapterVideo' onChange={(url)=>{
          if(url){
            onSubmit({videoUrl:url})
          }
        }}/>

        <div className="text-sm text-muted-foreground mt-4">
          Upload this chapter&apos;s video
        </div>
       </div>}
       {initialData.videoUrl && !editing &&(
           <div className="text-xs text-muted-foreground mt-2">
              Videos can take a few minutes to process.Refresh the page if video does not appear
           </div>
       )}
    </div>
  
      
  
)}


export default ChapterVideoForm