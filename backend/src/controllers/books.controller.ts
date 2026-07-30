import { Request,Response } from "express";
import prisma from '../prisma'

export const createBook=async(req:Request,res:Response)=>{
    try{
        const {title,author,price,description,stock,categoryId}=req.body
        const category=await prisma.category.findUnique({
            where:{id:categoryId}
        })
        if(!category)return res.status(400).json({error:'категория не найдена'})

        const book=await prisma.book.create({
            data:{
                title,
                author,
                price,
                description,
                stock,
                categoryId
            },
            include:{category:true}
        })
        res.status(201).json(book)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка создания книги'})
    }
}

export const getAllBooks=async(req:Request,res:Response)=>{
    try{
        const {search,categoryId,minPrice,maxPrice,sort,page=1,limit=10}=req.query
        const pageNumber=Number(page)
        const limitNumber=Number(limit)
        const skip=(pageNumber-1)*limitNumber
        const filters:any={}

        if(search){
            filters.OR=[
                {title:{contains:String(search)}},
                {author:{contains:String(search)}}
            ]
        }

        if(categoryId)filters.categoryId=Number(categoryId)
        if(minPrice||maxPrice){
            filters.price={}
            if(minPrice)filters.price.gte=Number(minPrice)
            if(maxPrice)filters.price.lte=Number(maxPrice)
        }

        let orderBy:any={createdAt:'desc'}
        if(sort){
            switch(sort){
                case 'price_asc':
                    orderBy={price:'asc'}
                    break
                case 'price_desc':
                    orderBy={price:'desc'}
                    break
                case 'rating_desc':
                    orderBy={createdAt:'desc'}
                    break
                case 'newest':
                    orderBy={createdAt:'desc'}
                    break
                default:
                    orderBy={createdAt:'desc'}
            }
        }

        const books=await prisma.book.findMany({
            where:filters,
            include:{
                category:true,
                reviews:{select:{rating:true}}
            },
            orderBy:orderBy,
            skip:skip,
            take:limitNumber
        })

        const totalBooks=await prisma.book.count({where:filters})
        const booksWithRating=books.map(book=>{
            const ratings=book.reviews.map(r=>r.rating)
            const avgRating=ratings.length>0?ratings.reduce((a,b)=>a+b,0)/ratings.length:0
            return{
                ...book,avgRating
            }
        })
        
        res.json({
            books:booksWithRating,
            pagination:{
                total:totalBooks,
                page:pageNumber,
                limit:limitNumber,
                pages:Math.ceil(totalBooks/limitNumber)
            }
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получания книг'})
    }
}

export const getBookId=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params
        const book=await prisma.book.findUnique({
            where:{id:Number(id)},
            include:{
                category:true,
                reviews:{
                    select:{
                        id:true,
                        rating:true,
                        text:true,
                        userId:true,
                        createdAt:true,
                        user:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })
        if(!book)return res.status(404).json({error:'книга не найдена'})
        const ratings=book.reviews.map(r=>r.rating)
        const avgRating=ratings.length>0
            ?ratings.reduce((a,b)=>a+b,0)/ratings.length
            :null
        res.json({
            ...book,
            avgRating
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения книги'})
    }
}

export const updateBook=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params
        const {title,author,price,description,stock,categoryId}=req.body
        const existingBook=await prisma.book.findUnique({
            where:{id:Number(id)}
        })
        if(!existingBook)return res.status(404).json({error:'книга не найдена'})
        if(categoryId){
            const category=await prisma.category.findUnique({
                where:{id:categoryId}
            })
            if(!category)return res.status(400).json({error:'категория не найдена'})

            const book=await prisma.book.update({
                where:{id:Number(id)},
                data:{
                    title,
                    author,
                    price,
                    description,
                    stock,
                    categoryId
                },
                include:{category:true}
            })
            res.json(book)
        }
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка обновления книги'})
    }
}

export const deleteBook=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params
        const existingBook=await prisma.book.findUnique({
            where:{id:Number(id)}
        })
        if(!existingBook)return res.status(404).json({error:'книга не найдена'})
        await prisma.book.delete({
            where:{id:Number(id)}    
        })
        res.json({message:'книга удалена'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка удаления книги'})
    }
}