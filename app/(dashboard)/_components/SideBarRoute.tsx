"use client"

import { BarChart, Compass, Layout, List, Search } from "lucide-react"
import SideBarItem from "./SideBarItem"
import { usePathname } from "next/navigation"


const guestRoute=[
    {
        icon:Layout,
        href:'/',
        label:"Dashboard"
    }
    ,{
        icon:Compass,
        href:"/search",
        label:"Browse"

    }
]

const teacherRoute=[
    {
        icon:List,
        href:'/teacher/courses',
        label:"Courses"

    },
    {
        icon:BarChart,
        href:"/teacher/analytics",
        label:"Analytics"
    }
]

const SideBarRoute = () => {

        const pathname=usePathname()
        let isTeacherPage=pathname.includes("/teacher")
         const routes=isTeacherPage? teacherRoute:guestRoute
         return (
         routes.map((route)=>{
            return (
                <div className="flex w-full flex-col">
                    <SideBarItem key={route.href} {...route}/>
                </div>
            )
         })
         )


}

export default SideBarRoute
