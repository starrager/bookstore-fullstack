import {Router} from 'express'
import {register,login,getProfile} from '../controllers/auth.controller'
import {authMiddleWare} from '../middleware/auth.middleware'

const router=Router()

router.post('/register',register)
router.post('/login',login)

router.get('/profile',authMiddleWare,getProfile)

export default router