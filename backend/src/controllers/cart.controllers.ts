import { Request,Response } from "express";
import prisma from '../prisma'

export const getCart=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const cart=await prisma.cart.findUnique({
            where:{userId:userId!},
            include:{
                items:{
                    include:{
                        book:{
                            include:{
                                category:true
                            }
                        }
                    }
                }
            }
        })

        if(!cart)return res.status(400).json({error:"корзина не найдена"})
        const total=cart.items.reduce((sum:any,item:any)=>{
            return sum+(item.book.price*item.quantity)    
        },0)

        res.json({...cart,total})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения корзины'})
    }
}

export const addToCart=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {bookId,quantity}=req.body

        if(!bookId)return res.status(400).json({error:'id книги обязателен'})

        const qty=quantity||1
        const book=await prisma.book.findUnique({where:{id:Number(bookId)}})

        if(!book)return res.status(404).json({error:'книга не найдена'})
        if(book.stock<qty)return res.status(400).json({error:'недостаточно книг на складе'})

        const cart=await prisma.cart.findUnique({
            where:{userId:userId!},
            include:{
                items:{
                    where:{bookId:bookId}
                }
            }
        })
        if(!cart)return res.status(404).json({error:'корзина не найдена'})

        if(cart.items.length>0){
            const existingItem=cart.items[0]
            const newQuatity=existingItem.quantity+qty

            if(book.stock<newQuatity)return res.status(400).json({error:'недостаточно книг на складе'})

            const updatedItem=await prisma.cartItem.update({
                where:{id:existingItem.id},
                data:{quantity:newQuatity},
                include:{book:true}
            })

            return res.json(updatedItem)
        }

        const cartItem=await prisma.cartItem.create({
            data:{
                cartId:cart.id,
                bookId:Number(bookId),
                quantity:qty
            },
            include:{book:true}
        })
        
        res.status(201).json(cartItem)

    }catch(error){
        console.error(error)
        res.json({error:'ошибка добавления в корзину'})
    }
}

export const updateCartItem=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const itemId=Number(req.params.id)
        const quantity=req.body

        if(!quantity||quantity<1)return res.status(400).json({errro:'неверное количество'})

        const cartItem=await prisma.cartItem.findUnique({
            where:{id:itemId},
            include:{
                cart:true,book:true
            }
        })

        if(!cartItem)return res.status(404).json({error:'элемент корзины не найден'})
        if(cartItem.cart.userId!==userId)return res.status(403).json({error:'доступ запрещен'})
        if(cartItem.book.stock<quantity)return res.status(400).json({error:'недостаточно книг на складе'})

        const updatedItem=await prisma.cartItem.update({
            where:{id:itemId},
            data:{quantity},
            include:{book:true}
        })

        res.json(updatedItem)

    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка обновления корзины'})       
    }
}

export const removeFromCart=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const itemId=Number(req.params.id)

        const cartItem=await prisma.cartItem.findFirst({
            where:{id:itemId},
            include:{
                cart:true
            }
        })

        if(!cartItem)return res.status(404).json({errro:'элемент корзины не найден'})
        if(cartItem.cart.userId!=userId)return res.status(403).json({error:'жоступ запрещен'})

        await prisma.cartItem.delete({
            where:{id:itemId}
        })

        res.json({message:'товар удален из корзины'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка удаления из корзины'})
    }
}

export const clearCart=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const cart=await prisma.cart.findUnique({where:{id:userId!}})

        if(!cart)return res.status(404).json({error:'корзина не найдена'})

        await prisma.cartItem.deleteMany({where:{cartId:cart.id}})

        res.json({message:'корзина очищена'})

    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка очистки корзины'})
    }
}