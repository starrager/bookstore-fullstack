import { Request,Response,NextFunction } from "express";
import { ZodError } from "zod/v3";

export const validate=(schema:any)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            req.body=await schema.parseAsync(req.body)
            next()
        }catch(error){
            if(error instanceof ZodError){
                return res.status(400).json({
                    error:'Validation failed',
                    datails:error.errors.map((e)=>({
                        field:e.path.join('.'),
                        message:e.message
                    }))
                })
            }
            next(error)
        }
    }
}