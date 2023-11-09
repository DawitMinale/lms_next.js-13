import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import TitleForm from './_components/TitleForm'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import CategoryForm from './_components/CatagoryForm'
import PriceForm from './_components/PriceForm'
import AttachmentForm from './_components/AttachmentForm'
import ChapterForm from './_components/ChapterForm'
import { Banner } from '@/app/(dashboard)/_components/banner'
import Actions from './_components/actions'

async function CourseIdPage  ({
    params
}:{params:{courseId:string}}) {

        const {userId}=auth()
        if(!userId){
            redirect('/')
        }
        const course=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId

            },
            include:{
                chapters:{
                    orderBy:{
                        position:'asc'
                    }
                },
                attachments:{
                    orderBy:{
                        createdAt:'desc'
                    }
                }
            }
        })

        const catagories=await db.category.findMany({
            orderBy:{
                name:"asc"
            },
            
        })
        if(!course){
            redirect('/')
        }

        const requiredField=[
            course.title,
            course.price,
            course.description,
            course.imageUrl,
            course.categoryId,
            course.chapters.some((chapter)=>chapter.isPublished)
        ]
        const totalField=requiredField.length
        const completedField=requiredField.filter(Boolean).length
        const completionText=`(${completedField} / ${totalField})`

        const isComplete=requiredField.every(Boolean)


  return (
    <>
    {!course.isPublished &&(

            <Banner label='This course is unpublished.it will not be visible to the students'/>
    
    )}
    <div className='p-20 md:p-6'>
        <div className="flex justify-evenly items-center">
            <div className="flex flex-col gap-y-2">
                <h1 className='font-medium text-2xl p-2'>Course Setup</h1>
                <span className='text-sm text-slate-600'>
                    complete all field {completionText}
                </span>
            </div>
            
                <Actions 
                    disabled={!isComplete}
                    courseId={params.courseId}
                    isPublished={course.isPublished}
                
                />
            
         

        </div>
        <div className="flex items-center gap-x-2 mt-4">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                    Customize Your Course
                </h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                <div className="grid grid-cols-1  gap-6 mt-8">
                    
                    <TitleForm initialData={course} courseId={course.id}/>
                    <DescriptionForm initialData={course} courseId={course.id}/>
                    <ImageForm initialData={course} courseId={course.id}/>
                    <CategoryForm initialData={course} courseId={course.id} options={catagories.map((category)=>(
                        {
                        label:category.name,
                        value:category.id
                        }

                        ))} />
                </div>
                <div className='space-y-6'>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">
                                    Course Chapters
                                </h2>
                            </div>
                            <ChapterForm initialData={course} courseId={course.id}/>

                       </div>
                       <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={CircleDollarSign}/>
                                <h2 className='text-xl'>Sell your course</h2>
                            </div>
                            <PriceForm initialData={course} courseId={course.id}/>
                       </div>
                </div>
                <div>
                    <div className='flex items-center gap-x-2'>
                                <IconBadge icon={File}/>
                                <h2 className='text-xl'>Resource and Attachments</h2>
                    </div>
                    <AttachmentForm initialData={course} courseId={course.id}/>
                </div>
          </div>
    </div>
    </>
  )
}

export default CourseIdPage