import { Request,Response } from "express";
import prisma from '../prisma'

export const getStats=async(req:Request,res:Response)=>{
    try{
        const totalUsers=await prisma.user.count()
        const totalBooks=await prisma.book.count()
        const totalOrders=await prisma.order.count()
        const totalReviews=await prisma.review.count()

        const revenueResult=await prisma.order.aggregate({
            _sum:{total:true},
            where:{status:'delivered'}
        })
        const totalRevenue=revenueResult._sum.total||0

        const ordersByStatus=await prisma.order.groupBy({
            by:['status'],
            _count:true
        })

        const topBooks=await prisma.orderItem.groupBy({
            by:['bookId'],
            _sum:{quantity:true},
            orderBy:{_sum:{quantity:'desc'}},
            take:5
        })

        const topBookWithDetails=await Promise.all(
            topBooks.map(async(item)=>{
                const book=await prisma.book.findUnique({
                    where:{id:item.bookId},
                    select:{
                        id:true,
                        title:true,
                        author:true,
                        price:true
                    }
                })
                return{
                    ...book,
                    totalSold:item._sum.quantity
                }
            })
        )
        res.json({
            totalUsers,
            totalBooks,
            totalOrders,
            totalReviews,
            totalRevenue,
            ordersByStatus,
            topBooks:topBookWithDetails
        })
    }catch(error){
        console.log(error)
        res.status(500).json({error:'error getting statistics'})
    }
}