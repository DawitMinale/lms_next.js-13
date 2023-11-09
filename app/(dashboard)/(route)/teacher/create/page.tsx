"use client"
import React, { useRef } from 'react'
import * as z from 'zod';
import {  useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from"axios"
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const formSchema=z.object({
    title:z.string().min(1,{
        message:"Title is Required"
    })
})


const createCourse = () => {
    const router=useRouter()

    const form=useForm<z.infer<typeof formSchema >>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            title:" "
        }

    })
    const{isSubmitting,isValid}=form.formState

    async function onSubmit(values:z.infer<typeof formSchema>){
            try {
                const response=await axios.post("/api/courses",values)
                router.push(`/teacher/courses/${response.data.id}`)
                toast.success("Course Created")
                
            } catch (error) {
                toast.error("something went wrong")
            }

            
    }



  return (
    <div className='max-w-5xl mx-auto flex flex-col md:justify-center md:items-start h-full p-10'>
            <h1 className='text-2xl pb-3'>
                Name Your Course
            </h1>
            <p className='text-slate-600 text-sm '>
                What would you like to name your course? Don&apos;t worry you can change later
            </p>
            
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 md:ml-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} placeholder="eg Advanced Web Development" {...field} className='px-3' />
              </FormControl>
              <FormDescription>
                What you will teach in this Course?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       <div className='flex space-x-5'>
         <Link href='/'>
            <Button type="button" variant='ghost'>Cancel</Button>
        </Link>
            <Button type="submit" disabled={isSubmitting || !isValid}>Continue</Button>
         </div>
      </form>
    </Form>
  

    </div>
  
)}

export default createCourse