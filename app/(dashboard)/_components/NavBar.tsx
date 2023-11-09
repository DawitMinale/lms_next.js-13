import React from 'react'
import MobileNavBar from './MobileNavBar'
import NavBarRoute from '../../../components/NavBarRoute'

const NavBar = () => {
  return (
    <div className='p-4  border-b h-full  flex items-center bg-white shadow-sm'>
        
        <MobileNavBar/>
        <NavBarRoute/>
    </div>
  )
}

export default NavBar
