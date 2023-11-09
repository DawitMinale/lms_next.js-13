"use client"

import { cn } from '@/lib/utils'
import React from 'react'
import { IconType } from 'react-icons'
import { useSearchParams,usePathname,useRouter } from "next/navigation"
import qs from "query-string"

interface CategoryItemProps{
  label:string,
  value?:string
  icon?:IconType
}

export const CategoryItem = ({label,value,icon:Icon}:CategoryItemProps) => {

  const searchParams=useSearchParams()
  const router=useRouter()
  const pathname=usePathname()
  const currentCategoryId=searchParams.get("categoryId");
  const currentTitle=searchParams.get("title")
  const isSelected=currentCategoryId===value

  const onClicked=()=>{
     const url=qs.stringifyUrl({
      url:pathname,
      query:{
        title:currentTitle,
        categoryId:isSelected ? "" :value
      },
     },

     {
      skipNull:true,skipEmptyString:true})

      console.log(currentTitle)
      console.log(currentCategoryId)
     router.push(url)
     
  }

  return (
    <button onClick={onClicked} type='button' className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800")}>
      {Icon &&<Icon size={20}/>}
      <div className="truncate">
        {label}
      </div>
    </button>
  )
}


