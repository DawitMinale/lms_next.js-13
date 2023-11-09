import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_combonents/data-table'
import { columns } from './_combonents/columns'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'



async function getData(): Promise<any[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}
const coursePage =async () => {


  const {userId}=auth()

  if(!userId){
    return redirect("/")
  }

const courses=await db.course.findMany({
  where:{
    userId
  },
  orderBy:{
    createdAt:"desc"
  }
})
  // const data=await getData()
  return (
    <div className='p-6'>

    

      <DataTable columns={columns} data={courses} />
      

      
    </div>
  )
}

export default coursePage
