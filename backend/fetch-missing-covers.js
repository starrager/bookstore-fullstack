const axios=require('axios')
const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient()

const fetchCoverId=async(title,author)=>{
    try{
        const query=encodeURIComponent(`${title} ${author}`)
        const url=`https://openlibrary.org/search.json?q=${query}&limit=1`
        const response=await axios.get(url)
        const docs=response.data.docs
        if(docs.length>0&&docs[0].cover_i){
            return docs[0].cover_i
        }
        return null
    }catch{
        return null
    }
}

const updateMissingCovers=async()=>{
    const books=await prisma.book.findMany({
        where:{coverId:null}
    })
    console.log(`📚 Найдено ${books.length} книг без обложки`)
    for(const book of books){
        const coverId=await fetchCoverId(book.title,book.author)
        if(coverId){
            await prisma.book.update({
                where:{id:book.id},
                data:{coverId}
            })
            console.log(`${book.title} — coverId ${coverId}`)
        }else{
            console.log(`${book.title} — обложка не найдена`)
        }
    }
    console.log('🎉 Готово!')
    await prisma.$disconnect()
}

updateMissingCovers()