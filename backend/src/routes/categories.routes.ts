import {Router} from 'express'
import { createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } from '../controllers/categories.controller'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

router.get('/',getAllCategories)
router.get('/:id',getCategoryById)

router.post('/',authMiddleWare,createCategory)
router.put('/:id',authMiddleWare,updateCategory)
router.delete('/:id',authMiddleWare,deleteCategory)

export default router