import {Router} from 'express'
import { getProfile,updateProfile,updatePassword } from '../controllers/users.controller'
import { authMiddleWare } from '../middleware/auth.middleware'
import { validate } from '../middleware/validator.middleware'
import { updateProfileSchema,updatePasswordSchema } from '../validators/user.validator'

const router=Router()

router.get('/me',authMiddleWare,getProfile)
router.put('/me',authMiddleWare,validate(updateProfileSchema),updateProfile)
router.put('/me/password',authMiddleWare,validate(updatePasswordSchema),updatePassword)

export default router