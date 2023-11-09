const {PrismaClient}=require("@prisma/client")


const database=new PrismaClient()

async function main(){
    try {
        await database.category.deleteMany({});

         await database.category.createMany({
            data:[
                {name:"Music"},
                {name:"Accounting"},
                {name:"Photography"},
                {name:"Filming"},
                {name:"Engineering"},
                {name:"Fitness"},
                {name:"Computer Science"},

            ]
         })
        
    } catch (error) {
        console.log(error);
        
    } finally{
        await database.$disconnect()
    }
}

main()


