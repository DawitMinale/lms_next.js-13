import { db } from '@/lib/db'
import React from 'react'
import Catagories from './_components/catagories'
import SearchInput from '@/components/SearchInput'
import { getCourses } from '@/actions/getcourses'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import CourseList from '../../_components/CourseList'




const page =async ({searchParams}:{searchParams:{title:string,categoryId:string}}) => {
  const{userId}=auth()
  if(!userId){
    return redirect('/')
  }


  const catagories=await db.category.findMany({
    orderBy:{
      name:"asc"
    }
  })

  const courses =await getCourses({
    userId,
    ...searchParams

  });

  
  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>

      <SearchInput/>
       </div>
    <div className='p-6'>
     <Catagories items={catagories}/>
     <CourseList items={courses}/>
    </div>
    </>
  )
}

export default page
