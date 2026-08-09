import {Router} from 'express'
import {register,login,getProfile} from '../controllers/auth.controller'
import {authMiddleWare} from '../middleware/auth.middleware'
import { registerSchema,loginSchema } from '../validators/auth.validator'
import { validate } from '../middleware/validator.middleware'

const router=Router()

router.post('/register',validate(registerSchema),register)
router.post('/login',validate(loginSchema),login)

router.get('/profile',authMiddleWare,getProfile)

export default router