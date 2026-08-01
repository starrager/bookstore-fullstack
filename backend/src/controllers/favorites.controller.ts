import { Request,Response } from "express";
import prisma from '../prisma'

export const addFavorite=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {bookId}=req.body

        if(!userId)return res.status(403).json({error:'не авторизирован'})
        if(!bookId)return res.status(400).json({error:'id книги обязателен'})

        const book=await prisma.book.findUnique({where:{id:Number(bookId)}})
        if(!book)return res.status(404).json({error:'книга не найдена'})

        const existing=await prisma.favorite.findUnique({
            where:{
                userId_bookId:{
                    userId:userId,
                    bookId:Number(bookId)
                }
            }
        })

        if(existing)return res.status(400).json({error:'книга уже добавлена в избранное'})

        const favorite=await prisma.favorite.create({
            data:{
                userId:userId,
                bookId:Number(bookId)
            },
            include:{book:true}
        })
        res.status(201).json(favorite)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка добавления в избранное'})
    }
}

export const removeFavorite=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {bookId}=req.params

        if(!userId)return res.status(403).json({error:'не авторизирован'})

        const favorite=await prisma.favorite.findUnique({
            where:{
                userId_bookId:{
                    userId:userId,
                    bookId:Number(bookId)
                }
            }
        })

        if(!favorite)return res.status(404).json({error:'книга не найдена в избранном'})

        await prisma.favorite.delete({
            where:{
                userId_bookId:{
                    userId:userId,
                    bookId:Number(bookId)
                }
            }
        })
        res.json({message:'книга удалена из избранного'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка удаления из избранного'})
    }
}

export const getFavorites=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        if(!userId)return res.status(403).json({error:'не авторизирован'})
        
        const favorites=await prisma.favorite.findMany({
            where:{userId:userId},
            include:{
                book:{
                    include:{category:true}
                }
            }
        })

        const books=favorites.map(f=>f.book)
        res.json(books)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения из избранного'})
    }
}

export const checkFavorite=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {bookId}=req.body

        if(!userId)return res.status(403).json({error:'не авторизирован'})

        const favorite=await prisma.favorite.findUnique({
            where:{
                userId_bookId:{
                    userId:userId,
                    bookId:Number(bookId)
                }
            }
        })

        res.json({isfavorite:!!favorite})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка проверки избранного'})
    }
}