import { Request,Response } from "express";
import prisma from '../prisma'
import bcrypt from 'bcrypt'
import { dmmfToRuntimeDataModel } from "@prisma/client/runtime/library";

export const getProfile=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        if(!userId)return res.status(401).json({error:'Unauthorized'})
        
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                createdAt:true,
                updatedAt:true
            }
        })

        if(!user)return res.status(404).json({error:'User not found'})
        res.json(user)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Internal server error'})
    }
}

export const updateProfile=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {name,email}=req.body

        if(!userId)return res.status(401).json({error:'Unauthorized'})
        if(email){
            const existingUser=await prisma.user.findFirst({
                where:{
                    email,
                    id:{not:userId}
                }
            })
            if(existingUser)return res.status(400).json({error:'email already in use'})
        }

        const user=await prisma.user.update({
            where:{id:userId},
            data:{
                name:name||undefined,
                email:email||undefined
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                updatedAt:true
            }
        })
        res.json(user)
    }catch(error){
        console.error(error)
        return res.status(500).json({error:'Internal server error'})
    }
}

export const updatePassword=async(req:Request,res:Response)=>{
    try{
        const userId=req.userId
        const {currentPassword,newPassword}=req.body

        if(!userId)return res.status(401).json({error:'Unauthorized'})

        const user=await prisma.user.findUnique({where:{id:userId}})

        if(!user)return res.status(404).json({error:'User not found'})

        const isPasswordValid=await bcrypt.compare(currentPassword,user.password)
        if(!isPasswordValid)return res.status(400).json({error:'Currect passowrd is incorrect'})

        const hashedPassword=await bcrypt.hash(newPassword,10)
        await prisma.user.update({
            where:{id:userId},
            data:{password:hashedPassword}
        })
        res.json({message:'Password updated successfully'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Internar server error'})
    }
}