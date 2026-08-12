import {z} from 'zod'

export const updateProfileSchema=z.object({
    name:z.string().min(2,'Name must be al least 2 characters').optional(),
    email:z.string().email('Invalid email format').optional()
})

export const updatePasswordSchema=z.object({
    currentPassword:z.string().min(1,'Current password is required'),
    newPassword:z.string().min(0,'New password must be at least 6 characters')
})