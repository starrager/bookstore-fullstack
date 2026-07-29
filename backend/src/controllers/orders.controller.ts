import { Request,Response } from "express";
import prisma from '../prisma'

export const createOrder=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {address,phone}=req.body

        if(!userId)return res.status(401).json({error:'не авторизирован'})

        if(!address||!phone)return res.status(400).json({error:'адрес и телефон обязательны'})

        const cart=await prisma.cart.findUnique({
            where:{userId:userId},
            include:{
                items:{
                    include:{
                        book:true
                    }
                }
            }
        })
        if(!cart)return res.status(404).json({error:'корзина не найдена'})
        if(cart.items.length===0)return res.status(400).json({error:'корзина пуста'})

        let  total=0
        const orderItems=[]

        for(const item of cart.items){
            if(item.book.stock<item.quantity)return res.status(400).json({error:`недостаточно книг ${item.book.title} на складе`})
            
            total+=item.book.price*item.quantity

            orderItems.push({
                bookId:item.bookId,
                quantity:item.quantity,
                price:item.book.price
            })
        }

        const order=await prisma.order.create({
            data:{
                userId:userId,
                total,
                address,
                phone,
                items:{create:orderItems}
            },
            include:{
                items:{
                    include:{book:true}
                }
            }
        })

        for(const item of cart.items){
            await prisma.book.update({
                where:{id:item.bookId},
                data:{
                    stock:{
                        decrement:item.quantity
                    }
                }
            })
        }

        await prisma.cartItem.deleteMany({
            where:{cartId:cart.id}
        })
        res.status(201).json(order)
    }catch(error){
        console.error(error)
        res.status(500).status(500).json({error:'ошибка создания заказа'})
    }
}

export const getOrders=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const orders=await prisma.order.findMany({
            where:{userId:userId},
            include:{
                items:{
                    include:{book:true}
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        res.json(orders)

    }catch(error){
        console.error(error)
        res.status(500).status(500).json({error:'ошибка получения заказов'})
    }
}

export const getOrderById=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const id=req.params
        const order=await prisma.order.findUnique({
            where:{id:Number(id)},
            include:{items:{include:{book:true}}}
        })

        if(!order)return res.status(404).json({error:'заказ не найден'})

        if(order.userId!==userId){
            const user=await prisma.user.findUnique({where:{id:userId!}})
            if(user?.role!=='admin')return res.status(403).json({error:'доступ запрещен'})
        }

        res.json(order)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения заказа'})
    }
}

export const updateOrderStatus=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {id}=req.params
        const {status}=req.body
        const user=await prisma.user.findUnique({where:{id:userId!}})

        if(user?.role!=='admin')return res.status(404).json({error:'доступ запрещен'})

        const validStatuses:any=['pending','paid','shipped','delivered','candeled']
        if(!validStatuses.includes(status)){
            return res.status(400).json({error:`неверный статус ${validStatuses.join(', ')}`})
        }

        const order=await prisma.order.update({
            where:{id:Number(id)},
            data:{status},
            include:{items:{include:{book:true}}}
        })

        res.json(order)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка обновления статуса'})
    }
}

export const cancelOrder=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const id=req.params

        const order=await prisma.order.findUnique({where:{id:Number(id)},include:{items:true}})
        if(!order)return res.status(404).json({error:'заказ не найден'})

        if(order.userId!==userId){
            const user=await prisma.user.findUnique({where:{id:userId!}})
            if(user?.role!=='admin')return res.status(403).json({error:'доступ запрещен'})
        }

        if(order.status!=='pending'&&order.status!=='paid'){
            return res.status(400).json({error:`нельзя отменить заказ со статусом ${order.status}`})
        }

        for(const item of order.items){
            await prisma.book.update({
                where:{id:item.bookId},
                data:{
                    stock:{
                        increment:item.quantity
                    }
                }
            })
        }

        const updatedOrder=await prisma.order.update({
            where:{id:Number(id)},
            data:{status:'canceled'},
            include:{items:{include:{book:true}}}
        })

        res.json(updatedOrder)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка отмены заказа'})
    }
}