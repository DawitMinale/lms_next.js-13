import { db } from '@/lib/db';
import React from 'react'

export const getProgress = async ( userId:string,courseId:string):Promise<number> => {
 try {
    const publishedChapters=await db.chapter.findMany({
        where:{
            courseId:courseId,
            isPublished:true
        },
        select:{
            id:true  
        }
    })

    const publishedChapterIds=publishedChapters.map((chapter=>chapter.id))

    const validCompletedChapters=await db.userProgress.count({
        where:{
            userId:userId,
            chapterId:{
                in:publishedChapterIds
            }
        }
    })

    const processPercentage=(validCompletedChapters/publishedChapterIds.length) * 100
    return processPercentage
 } catch (error) {
    console.log("getProgress",error);
    return 0
    
    
 }
}

