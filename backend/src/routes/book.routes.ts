import {Router} from 'express'
import {createBook,getAllBooks,getBookId,updateBook,deleteBook} from '../controllers/books.controller'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

//общий доступ
router.get('/',getAllBooks)
router.get('/:id',getBookId)

//доступ только для админа
router.post('/',authMiddleWare,createBook)
router.put('/:id',authMiddleWare,updateBook)
router.delete('/:id',authMiddleWare,deleteBook)

export default router