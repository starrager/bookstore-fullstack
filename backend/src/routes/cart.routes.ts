import Router from 'express'
import {clearCart,removeFromCart,updateCartItem,addToCart,getCart} from '../controllers/cart.controllers'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

router.get('/',authMiddleWare,getCart)
router.post('/add',authMiddleWare,addToCart)
router.delete('/item/:id',authMiddleWare,removeFromCart)
router.delete('/clear',authMiddleWare,clearCart)
router.put('/clear',authMiddleWare,updateCartItem)

export default router