import {Router} from 'express'
import {getStats} from '../controllers/admin.controller'
import { authMiddleWare } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router=Router()

router.get('/stats',authMiddleWare,adminMiddleware,getStats)

export default router