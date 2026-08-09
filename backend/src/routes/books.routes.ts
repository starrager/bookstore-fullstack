import {Router} from 'express'
import {createBook,getAllBooks,getBookId,updateBook,deleteBook} from '../controllers/books.controller'
import { authMiddleWare } from '../middleware/auth.middleware'
import { createBookSchema,updateBookSchema } from '../validators/book.validator'
import { validate } from '../middleware/validator.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router=Router()

router.get('/',getAllBooks)
router.get('/:id',getBookId)

router.post('/',authMiddleWare,adminMiddleware,validate(createBookSchema),createBook)
router.put('/:id',authMiddleWare,adminMiddleware,validate(updateBookSchema),updateBook)
router.delete('/:id',authMiddleWare,adminMiddleware,deleteBook)

export default router