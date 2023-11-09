"use client"

import { Button } from "@/components/ui/button"
import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import {
     DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
 } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"




export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell:({row})=>{
        const price=parseFloat(row.getValue("price") || "0")
        const formatted= new Intl.NumberFormat("en-US",{
          style:"currency",
          currency:"USD"
        }).format(price)

        return <div>{formatted}</div>
      }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell:({row})=>{
          const isPublished=row.getValue("isPublished") || false
          return (
            <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
              {isPublished ?"published":"draft"}
            </Badge>
          )
        }
      
    },
     {
        id:"actions",
        cell:({row})=>{
            const {id}=row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-4 w-8 p-0">
                            <span className="sr-only">
                                Open Menu
                            </span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/teacher/courses/${id}`}>
                           <DropdownMenu>
                            <div className="flex px-6 py-2 mr-2 shadow-lg rounded-md hover:bg-slate-300">
                                <Pencil className="h-4 w-4 mr-2"/>
                               Edit
                            </div>
                            </DropdownMenu> 
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
                
            )
        }
    
      }
    
  
    
]
