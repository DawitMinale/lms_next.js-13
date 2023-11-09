import React, { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import NavBar from './_components/NavBar'

const layout = ({children}:{
    children:ReactNode
}) => {
  return (
    <div className='h-full'>
        <div className='fixed h-[80px] w-full md:pl-56 z-50 inset-y-0 '>
          <NavBar/>
        </div>
        <div className='inset-y-0 hidden md:flex flex-col w-56 h-full fixed z-50'>
            <Sidebar/>
        </div>
        <main className='md:pl-56 pt-[80px] '>
            {children}
        </main>
        
    </div>
  )
}

export default layout
