import Router from 'express'
import {checkFavorite,getFavorites,removeFavorite,addFavorite} from '../controllers/favorites.controller'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

router.get('/',authMiddleWare,getFavorites)
router.post('/',authMiddleWare,addFavorite)
router.delete('/:bookId',authMiddleWare,removeFavorite)
router.get('/check/:bookId',authMiddleWare,checkFavorite)

export default router