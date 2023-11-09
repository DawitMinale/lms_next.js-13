import { Category,Course } from "@prisma/client";
import {getProgress} from "./getProgress";
import { db } from "@/lib/db";

type courseWithProgressCategory= Course &{
    category:Category |null
    chapters:{id:string}[]
    progress :number | null
}

type GetCourses={
    userId:string
    title?:string
    categoryId?:string
}

export const getCourses=async({
    userId,title,categoryId
}:GetCourses):Promise<courseWithProgressCategory[]>=>{
    try {
        const courses=await db.course.findMany({
            where:{
                isPublished:true,
                title:{
                    contains:title
                },
                categoryId
            },
            include:{
                category:true,
                chapters:{
                    where:{
                        isPublished:true
                    },
                    select:{
                        id:true
                    }
                },
                purchases:{
                    where:{
                        userId
                    }
                
            }

            },
            orderBy:{
                createdAt:"desc"
            }
            
        })

        const coursesWithProgress:courseWithProgressCategory[]=await Promise.all(
            courses.map(async course=>{
                if(course.purchases.length===0){
                    return {...course,progress:null}
                }
                const processPercentage=await getProgress(userId,course.id) 
                return {...course,progress:processPercentage}
            })
        )
        return coursesWithProgress
    } catch (error) {
        console.log("[get_courses",error);
        return []
        
        
    }
}
