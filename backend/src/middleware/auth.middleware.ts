import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'

declare global{
    namespace Express{
        interface Request{
            userId?:number
        }
    }
}

export const authMiddleWare=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1]
        if(!token)return res.status(401).json({error:'токен не предоставлен'})
        const decoded=jwt.verify(token,process.env.JWT_SECRET||'secret_key')as{userId:number}
        req.userId=decoded.userId
        next()
    }catch(error){return res.status(401).json({error:'недействительный токен'})}
}