import Router from 'express'
import {deleteReview,updateReview,getReviewByBook,createReview} from '../controllers/reviews.contoller'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

router.get('/book/:bookId',getReviewByBook)
router.post('/',authMiddleWare,createReview)
router.delete('/:id',authMiddleWare,deleteReview)
router.put('/:id',authMiddleWare,updateReview)

export default router