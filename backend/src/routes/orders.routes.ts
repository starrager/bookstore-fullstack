import Router from 'express'
import {createOrder,getOrders,getOrderById,updateOrderStatus,cancelOrder} from '../controllers/orders.controller'
import { authMiddleWare } from '../middleware/auth.middleware'
import {adminMiddleware} from '../middleware/admin.middleware'
import { createOrderSchema,updateOrderSchema } from '../validators/order.validator'
import { validate } from '../middleware/validator.middleware'

const router=Router()

router.post('/',authMiddleWare,validate(createOrderSchema),createOrder)
router.get('/',authMiddleWare,getOrders)
router.get('/:id',authMiddleWare,getOrderById)
router.delete('/:id',authMiddleWare,cancelOrder)

router.put('/:id/status',authMiddleWare,adminMiddleware,validate(updateOrderSchema),updateOrderStatus)

export default router