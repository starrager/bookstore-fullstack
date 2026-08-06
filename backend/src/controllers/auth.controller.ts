import { Request,Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'

export const register=async(req:Request,res:Response)=>{
    try{
        const {email,password,name}=req.body

        const existingUser=await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){return res.status(400).json({error:'пользователь с таким же email уже существует'})}

        const hashedPassword=await bcrypt.hash(password,10)
        const user=await prisma.user.create({
            data:{
                email:email,
                password:hashedPassword,
                name:name
            }
        })

        await prisma.cart.create({
            data:{
                userId:user.id
            }
        })

        const token=jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET||'secret_key',
            {expiresIn:'7d'}
        )

        res.status(201).json({
            message:'пользователь создан',
            token,
            user:{
                id:user.id,
                email:user.email,
                name:user.name
            }
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка сервера'})
    }
}
//comment
export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body

        const user=await prisma.user.findUnique({
            where:{email}
        })

        if(!user)return res.status(400).json({error:'неверный email или неверный пароль'})

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid)return res.status(400).json({error:'неверный  или email'})

        const token=jwt.sign(
            {userId:user.id,email:user.email},
            process.env.JWT_SECRET||'secret_key',
            {expiresIn:'7d'}
        )

        res.json({
            message:'успешный вход',
            token,
            user:{
                id:user.id,
                email:user.email,
                name:user.name,
                role:user.role
            }
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка сервера'})
    }
}

export const getProfile=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const user=await prisma.user.findUnique({
            where:{id:userId},
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                createdAt:true
            }
        })

        if(!userId)return res.status(404).json({error:'пользователь не найден'})

        res.json(user)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка сервера'})
    }
}