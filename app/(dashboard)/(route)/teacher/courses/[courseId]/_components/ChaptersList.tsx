"use client"
import { Chapter } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {DragDropContext,Draggable,Droppable,DropResult} from "@hello-pangea/dnd";
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface chapterList{
    onEdit:(id:string)=>void,
    onReorder:(updateData:{id:string,position:number}[])=>void,
    items:Chapter[]
}
const ChaptersList = ({onEdit,onReorder,items}:chapterList) => {

  const [isMounting,setIsMounting]=useState(false)
  const [chapters,setChapters]=useState(items)

useEffect(()=>{
  setIsMounting(true)
},[])
useEffect(()=>{
   setChapters(items)
},[items])


const onDragEnd=(result:DropResult)=>{

  if(!result.destination) return
  const items=Array.from(chapters)
  const [reorderedItem]=items.splice(result.source.index,1)
  items.splice(result.destination.index,0,reorderedItem)
  const startIndex=Math.min(result.source.index,result.destination.index)
  const endIndex=Math.max(result.source.index,result.destination.index)


  const updatedChapters=items.slice(startIndex,endIndex+1)

  setChapters(items)

  const bulkUpdatedData=updatedChapters.map((chapter)=>({
    id:chapter.id,
    position:items.findIndex((item)=>item.id===chapter.id)

    
  }))
  onReorder(bulkUpdatedData)

}



if(!isMounting){
  return null
}
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided)=>(
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter,index)=>(
              <Draggable 
              key={chapter.id} 
              draggableId={chapter.id} 
              index={index}>
                {(provided)=>(
                    <div className={cn("flex items-center gap-x-2 bg-slate-300 border-slate-200 border text-slate-700 rounded-md mb-2" ,chapter.isPublished &&"bg-sky-100 border-sky-200 text-sky-700")}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                      <div className={cn('px-2 py-4 border-r-slate-200  hover:bg-slate-400 rounded-l-md transition' ,chapter.isPublished && "border-r-sky-200 hover:bg-sky-200")} {...provided.dragHandleProps}>
                        <Grip className='h-5 w-5'/>


                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && (
                          <Badge>
                            Free
                          </Badge>
                        )}

                        <Badge className={cn("bg-slate-500",chapter.isPublished &&"bg-slate-700")}>{chapter.isPublished? "Published": "Draft"}</Badge>
                        <Pencil className='h-4 w-4 mr-2 cursor-pointer opacity-75 hover:opacity-100 transition' onClick={()=>onEdit(chapter.id)}/>
                      </div>

                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList