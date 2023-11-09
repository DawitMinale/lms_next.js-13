import React from 'react'
import Logo from './logo'
import SideBarRoute from './SideBarRoute'

const Sidebar = () => {
  return (
    
        <div className='h-full md:flex flex-col bg-white shadow-sm border-r  overflow-auto'>
            <div className="p-6">
              <Logo/>
            </div>
            <div>
               <SideBarRoute/>
            </div>
           
        </div>
      
    
  )
}

export default Sidebar
