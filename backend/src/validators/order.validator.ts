import {z} from 'zod'

export const createOrderSchema=z.object({
    address:z.string().min(5,'Address is required'),
    phone:z.string().min(10,'Phone number is required')
})

export const updateOrderSchema=z.object({
    status:z.enum(['pending','paid','shipped','delivered','cancelled'])
})