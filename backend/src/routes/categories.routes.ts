import {Router} from 'express'
import { createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } from '../controllers/categories.controller'
import { authMiddleWare } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router=Router()

router.get('/',getAllCategories)
router.get('/:id',getCategoryById)

router.post('/',authMiddleWare,adminMiddleware,createCategory)
router.put('/:id',authMiddleWare,adminMiddleware,updateCategory)
router.delete('/:id',authMiddleWare,adminMiddleware,deleteCategory)

export default router