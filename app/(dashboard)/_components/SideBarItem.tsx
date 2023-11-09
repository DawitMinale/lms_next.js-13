import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface sidebar{
    icon:LucideIcon,
    href:string,
    label:string
}


const SideBarItem = ({icon:Icon,href,label}:sidebar) => {
  let pathname=usePathname()
  let router=useRouter()
  const onClick=()=>{
    router.push(href)
  }

  let isActive=(pathname==="/" && href==="/" ||pathname===href || pathname?.startsWith(`${href}/`))
  return (
    <button type='button' onClick={onClick} className={cn("flex gap-x-2 text-slate-500 text-sm font-[500] bg-slate-200/20 transition-all hover:text-slate-600 hover:bg-slate-300/20 ",isActive && "text-sky-800 bg-sky-100 hover:bg-sky-100 ")}>
        <div className='flex items-center gap-x-2 '>
             <Icon size={30} />
             {label}
        </div>
        
        <div className={cn("border-sky-800 border-2 py-7 h-full ml-auto opacity-0",isActive && "opacity-100")}></div>
    </button>
  )
}

export default SideBarItem
