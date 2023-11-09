import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const {Video}=new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(req:Request,{params}:{params:{courseId:string,chapterId:string}}) {
            try {
                const {userId}=auth()

                if (!params || !params.courseId) {
                    // Handle the case where params or courseId is undefined.
                    return new NextResponse("Bad Request", { status: 400 });
                  }
                if(!userId){
                    return new NextResponse("Unauthorized",{status:401})
                }

                const ownCourse=await db.course.findUnique({
                    where:{
                        id:params.courseId,
                        userId
                    
                    }
                })
                
                  
                
                
                if(!ownCourse){
                    return new NextResponse("Unauthorized",{status:401})
                }

                const chapter=await db.chapter.findUnique({
                    where:{
                        id:params.chapterId,
                        courseId:params.courseId
                    }
                })
                console.log("after  chapter");

                if(!chapter){
                    return new NextResponse('Not found',{status:404})
                }

                if(chapter.videoUrl){
                    const existingMuxData=await db.muxData.findFirst({
                        where:{
                            chapterId:params.chapterId
                        }
                    })

                    if(existingMuxData){
                        await Video.Assets.del(existingMuxData.assetId)
                        await db.muxData.delete({
                            where:{
                                id:existingMuxData.id
                            }
                        })
                    }
                }


                const deletedChapter=await db.chapter.delete({
                    where:{
                        id:params.chapterId
                    }
                })

                const PublishedChaptersInCourse=await db.chapter.findMany({
                    where:{
                        courseId:params.courseId,
                        isPublished:true
                    }
                })

                if(!PublishedChaptersInCourse.length){
                    await db.course.update({
                        where:{
                            id:params.courseId
                        },
                        data:{
                            isPublished:false
                        }
                    })
                }

                return NextResponse.json(deletedChapter) 


            } catch (error) {
                console.log("[CHAPTER_ID_DELETE",error);
                
                return new NextResponse("iNTERNAL ERROR",{status:500})
                
            }    
}

export async function PATCH(req:Request,{params}:{params:{courseId:string,chapterId:string}}) {

    try {
        const {isPublished,...values}= await req.json()
        const {userId}=auth()
        if(!userId){
            return new NextResponse("unauthorized",{status:401})
        }

        const ownCourse=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId

            }
        })
        if(!ownCourse){
            return new NextResponse("unauthorized",{status:401})
        }


        const chapter=await db.chapter.update({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            },
            data:{
                ...values
            }
            
        })

    if(values.videoUrl){
        const existingMuxData=await db.muxData.findFirst({
            where:{
                chapterId:params.chapterId,

            }
        })
        if(existingMuxData){
            await Video.Assets.del(existingMuxData.assetId)
            await db.muxData.delete({
                where:{
                    id:existingMuxData.id
                }
            })
        }
        const asset=await Video.Assets.create({
            input:values.videoUrl,
            playback_policy:'public',
            test:false
        })
        await db.muxData.create({
            data:{
                chapterId:params.chapterId,
                assetId:asset.id,
                playbackId:asset.playback_ids?.[0].id
            }
        })
    }
        

        return NextResponse.json(chapter)

        
    } catch (error) {

        console.log("[courses_chapter_id]")
        return new NextResponse("Internal Error",{status:500})
        
    }
    
}

