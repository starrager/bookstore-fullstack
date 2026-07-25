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
        const books=await prisma.book.findMany({
            include:{
                category:true,
                reviews:{
                    select:{
                        rating:true
                    }
                }
            }
        })
        const booksWithRating=books.map(book=>{
            const ratings=book.reviews.map(r=>r.rating)
            const avgRating=ratings.length>0
                ?ratings.reduce((a,b)=>a+b,0)/ratings.length
                :null
            return{
                ...book,
                avgRating
            }
        })
        res.json(booksWithRating)
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