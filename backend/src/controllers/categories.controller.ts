import { Request,Response } from "express";
import prisma from '../prisma'
import { REPLCommand } from "node:repl";

export const createCategory=async(req:Request,res:Response)=>{
    try{
        const name=req.body
        if(!name)return res.status(400).json({error:'название категории обязательно'})

        const existingCategory=await prisma.category.findUnique({where:{name}})
        if(existingCategory)return res.status(400).json({error:'категория с таким названием уже существует'})
        
        const category=await prisma.category.create({data:{name}})
        res.status(201).json(category)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка создания категории'})
    }
}

export const getAllCategories=async(req:Request,res:Response)=>{
    try{
        const categories=await prisma.category.findMany({
            include:{
                books:{
                    select:{
                        id:true,
                        title:true
                    }
                }
            }
        })
        res.json(categories)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения категорий'})
    }
}

export const getCategoryById=async(req:Request,res:Response)=>{
    try{
        const id=req.params
        const category=await prisma.category.findUnique({
            where:{id:Number(id)},
            include:{
                books:true
            }
        })
        if(!category)return res.status(400).json({error:'категория не найдена'})
        res.json(category)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка получения категории'})
    }
}

export const updateCategory=async(req:Request,res:Response)=>{
    try{
        const id=req.params
        const name=req.body
        if(!name)return res.status(400).json({error:'наазвание категории обязательно'})

        const existingCategory=await prisma.category.findUnique({where:{id:Number(id)}})
        if(!existingCategory)return res.status(400).json({error:'категория не найдена'})
        
        const duplicate=await prisma.category.findUnique({where:{name}})
        if(duplicate&&duplicate.id!==Number(id))return res.status(400).json({error:'категория с таким названием уже существует'})

        const category=await prisma.category.update({
            where:{id:Number(id)},
            data:{name}
        })
        res.json(category)

    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка обновления категории'})
    }
}

export const deleteCategory=async(req:Request,res:Response)=>{
    try{
        const id=req.params
        const existingCategory=await prisma.category.findUnique({
            where:{id:Number(id)},
            include:{books:true}
        })

        if(!existingCategory)return res.status(404).json({error:'категория не найдена'})
        if(existingCategory.books.length>0){
            return res.status(400).json({error:'нельзя удалить категорию с книгами, очистите категорию прежде чем удалять её'})
        }

        await prisma.category.delete({where:{id:Number(id)}})
        res.json({message:'категория удалена'})
    }catch(error){
        console.error(error)
        res.status(500).json({error:'ошибка удаления категории'})
    }
}