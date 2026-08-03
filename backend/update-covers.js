const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient()
const fs=require('fs')
const path=require('path')

const updateCovers=async()=>{
    const books=await prisma.book.findMany()
    for(const book of books){
        if(!book.coverId)continue
        const coverPath=path.join(__dirname,'../frontend/public/covers',`${book.coverId}.jpg`)
        if(fs.existsSync(coverPath)){
            console.log(`${book.title} — обложка есть`)
        }else{
            console.log(`${book.title} — обложки нет`)
        }
    }
}

updateCovers()
    .catch(console.error)
    .finally(()=>prisma.$disconnect())