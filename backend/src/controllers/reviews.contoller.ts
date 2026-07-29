import { Request,Response } from "express";
import prisma from '../prisma'

export const createReview=async(req:Request,res:Response)=>{
    try{
        const uesrId=req.userId
        const {bookId,rating,text}=req.body

        if(!uesrId)return res.status(401).json({error:'не авторизован'})
        if(!bookId||!rating)return res.status(400).json({error:'ID книги и рейтинг обязательны'})
        if(rating<1&&rating>5)return res.status(400).json({error:'оценка должна быть в пределах от 1 до 5'})

        const book=await prisma.book.findUnique({where:{id:Number(bookId)}})
        if(!book)return res.status(400).json({error:'книга не найдена'})
        
        const existingReview=await prisma.review.findUnique({
            where:{
                userId_bookId:{
                    userId:uesrId,
                    bookId:Number(bookId)
                }
            }
        })

        if(existingReview)return res.status(400).json({error:'вы уже оставили оценку на эту книгу'})

        const review=await prisma.review.create({
            data:{
                userId:uesrId,
                bookId:Number(bookId),
                rating:rating,
                text:text||null
            },
            include:{
                user:{
                    select:{name:true}
                }
            }
        })

        res.status(201).json(review)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка создания отзывав'})
    }
}

export const getReviewByBook=async(req:Request,res:Response)=>{
    try{
        const bookId=req.params
        const reviews=await prisma.review.findMany({
            where:{bookId:Number(bookId)},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            },
            orderBy:{createdAt:'desc'}
        })

        const ratings=reviews.map(r=>r.rating)
        const avgRating=ratings.length>0
            ?ratings.reduce((a,b)=>a+b,0)/ratings.length:0
        res.json({
            reviews,
            avgRating,
            total:reviews.length
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получпения отзыва'})
    }
}

export const updateReview=async(req:Request,res:Response)=>{
    try{
        const userId=req.body
        const id=req.params
        const {rating,text}=req.body

        if(!userId)return res.status(401).json({error:'доступ запрещен'})

        const review=await prisma.review.findUnique({where:{id:Number(id)}})
        if(!review)return res.status(404).json({error:'отзыв не найден'})
        if(userId!==review.userId)return res.status(403).json({error:'вы можете менять только свои отзывы'})
        if(rating&&(rating<1||rating>5))return res.status(400).json({error:'оценка должна быть в пределах от 1 до 5'})

        const updatedReview=await prisma.review.update({
            where:{id:Number(id)},
            data:{
                rating:rating||review.rating,
                text:text!==undefined?text:review.text
            },
            include:{user:{select:{name:true}}}
        })
        res.json(updateReview)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка обновления отзыва'})
    }
}

export const deleteReview=async(req:Request,res:Response)=>{
    try{
        const userId=req.body
        const {id}=req.params

        if(!userId)return res.status(401).json({error:'не авторизирован'})

        const review=await prisma.review.findUnique({where:{id:Number(id)}})
        if(!review)return res.status(404).json({error:'отзыв не найден'})

        if(review.userId!==userId){
            const user=await prisma.user.findUnique({where:{id:userId}})
            if(user?.role!=='admin')return res.status(403).json({error:'доступ запрещен'})
        }
        await prisma.review.delete({where:{id:Number(id)}})
        res.json({message:'отзыв удален'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка удаления отзыва'})
    }
}