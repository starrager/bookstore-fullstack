import {z} from 'zod'

export const createBookSchema=z.object({
    title:z.string().min(1,'Title is required'),
    author:z.string().min(1,'Author is required'),
    price:z.number().positive('Price must be greater than 0'),
    stock:z.number().int().min(0,'Stock cannot be negative'),
    categoryId:z.number().optional(),
    description:z.string().optional()
})

export const updateBookSchema=createBookSchema.partial()