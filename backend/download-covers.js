const axios=require('axios')
const fs=require('fs')
const path=require('path')
const {PrismaClient}=require('@prisma/client')

const prisma=new PrismaClient()
const COVERS_DIR=path.join(__dirname,'../frontend/public/covers')

if(!fs.existsSync(COVERS_DIR)){
    fs.mkdirSync(COVERS_DIR,{recursive:true})
}

const downloadCover=async(coverId)=>{
    try{
        const url=`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        const response=await axios.get(url,{responseType:'stream'})
        const filePath=path.join(COVERS_DIR,`${coverId}.jpg`)
        const writer=fs.createWriteStream(filePath)
        response.data.pipe(writer)
        return new Promise((resolve,reject)=>{
            writer.on('finish',resolve)
            writer.on('error',reject)
        })
    }catch{
        console.log(`Обложка ${coverId} не загружена`)
    }
}

const downloadAll=async()=>{
    const books=await prisma.book.findMany({
        select:{coverId:true},
        where:{coverId:{not:null}}
    })
    const coverIds=books.map(b=>b.coverId)
    console.log(`📥 Найдено ${coverIds.length} обложек`)
    for(const id of coverIds){
        await downloadCover(id)
        console.log(`${id}.jpg`)
    }
    console.log('Все обложки скачаны')
    await prisma.$disconnect()
}

downloadAll()