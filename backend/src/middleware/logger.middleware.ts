import { Request,Response,NextFunction } from "express";
import logger from '../logger'

export const logRequest=(req:Request,res:Response,next:NextFunction)=>{
    const start=Date.now()
    
    logger.info({
        type:'request',
        method:req.method,
        url:req.url,
        ip:req.ip
    })

    res.on('finish',()=>{
        const duration=Date.now()-start
        logger.info({
            type:'response',
            method:req.method,
            url:req.url,
            status:res.statusCode,
            duration:`${duration}ms`
        })
    })
    next()
}