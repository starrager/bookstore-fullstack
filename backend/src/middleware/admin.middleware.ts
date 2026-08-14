import { Request,Response,NextFunction } from "express";
import prisma from '../prisma'

export const adminMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.userId
        if(!userId)return res.status(401).json({error:'Unauthorized'})
        const user=await prisma.user.findUnique({where:{id:userId}})
        if(!user||user.role!=='admin')return res.status(403).json({error:'Forbidden. Admin only'})
        next()
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Internal server error'})
    }
}