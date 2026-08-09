import Router from 'express'
import {clearCart,removeFromCart,updateCartItem,addToCart,getCart} from '../controllers/cart.controllers'
import { authMiddleWare } from '../middleware/auth.middleware'
import { addToCartSchema,updateCartItemSchema } from '../validators/cart.validator'
import { validate } from '../middleware/validator.middleware'

const router=Router()

router.get('/',authMiddleWare,getCart)
router.post('/add',authMiddleWare,validate(addToCartSchema),addToCart)
router.delete('/item/:id',authMiddleWare,removeFromCart)
router.delete('/clear',authMiddleWare,clearCart)
router.put('/clear',authMiddleWare,validate(updateCartItem),updateCartItem)

export default router