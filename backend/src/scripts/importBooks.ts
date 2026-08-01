import axios from 'axios'
import {PrismaClient} from '@prisma/client'

const prisma=new PrismaClient()

const CONFIG={
    query:'fiction',
    limit:50,
    minPrice:300,
    maxPrice:1500
}

const normalizeCategory=(subjects:string[]):string=>{
    if(!subjects||subjects.length===0)return 'Other'

    const raw=subjects[0]
    const clean=raw.replace(/fiction/gi,'').replace(/novel/gi,'').replace(/story/gi,'').trim()

    if(!clean)return 'fiction'
    return clean.charAt(0).toUpperCase()+clean.slice(1)
}

const importBooks=async()=>{
    console.log('начало импорта книг')

    try{
        const response=await axios.get('https://openLibrary.org/search.json',{params:{
            q:CONFIG.query,
            limit:CONFIG.limit
        }})
        const docs=response.data.docs
        console.log(`найдено ${docs.length} книг`)

        let createdCount=0
        let skippedCount=0

        for(const book of docs){
            console.log(book.cover_i)
            const existing=await prisma.book.findFirst({
                where:{title:book.title||''}
            })

            if(existing){
                skippedCount++
                continue
            }

            const categoryName=normalizeCategory(book.subject)
            let category=await prisma.category.findUnique({where:{name:categoryName}})

            if(!category){
                category=await prisma.category.create({data:{name:categoryName}})
                console.log(`создана категория ${categoryName}`)
            }

            const price=Math.floor(Math.random()*(CONFIG.maxPrice-CONFIG.minPrice+1)+CONFIG.minPrice)
            const author=book.author_name?book.author_name.slice(0,3).join(', '):'неизвестный автор'
            const description=book.first_sentence?book.first_sentence.slice(0,3).join(', '):'описание не найдено'
            const stock=Math.floor(Math.random()*20)+1

            await prisma.book.create({
                data:{
                    title:book.title||'без названия',
                    author,
                    price,
                    description:description.slice(0,500),
                    stock,
                    categoryId:category.id,
                    coverId:book.cover_i||null
                }
            })

            createdCount++
            console.log(`добавлена ${book.title}`)
        }
        console.log(`Создано книг: ${createdCount}`)
        console.log(`Пропущено (дубли): ${skippedCount}`)
    }catch(error){
        console.error(error)
    }finally{await prisma.$disconnect()}
}

importBooks()