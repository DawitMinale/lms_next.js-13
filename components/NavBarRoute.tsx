"use client"
import { UserButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import SearchInput from './SearchInput'

const NavBarRoute = () => {
  let pathname=usePathname()
  
  const isTeacherPage=pathname?.startsWith('/teacher')
  const isPlayerPage=pathname?.includes('/chapter')
  const isSearchPage=pathname==='/search'

  return (
    <>

    {isSearchPage &&
    (
      <div className='hidden md:block'>
        <SearchInput/>
      </div>
    )}
    <div className='flex items-center ml-auto gap-x-2'>

      <div>
        {isPlayerPage || isTeacherPage ?(<Link href='/'>
          <Button >
            <LogOut className='h-4 w-4 mr-2'/>
                Exit 
            </Button>
            </Link>)
        :
      <Link href="/teacher/courses">
        <Button variant="ghost" size="sm" >
          Teacher Mode
        </Button>

      </Link>
}
      </div>

        <UserButton afterSignOutUrl='/'/>
    </div>
    </>
  )
}

export default NavBarRoute
