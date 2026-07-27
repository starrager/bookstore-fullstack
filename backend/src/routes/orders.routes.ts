import Router from 'express'
import {createOrder,getOrders,getOrderById,updateOrderStatus,cancelOrder} from '../controllers/orders.controller'
import { authMiddleWare } from '../middleware/auth.middleware'

const router=Router()

router.post('/',authMiddleWare,createOrder)
router.get('/',authMiddleWare,getOrders)
router.get('/:id',authMiddleWare,getOrderById)
router.put('/:id/status',authMiddleWare,updateOrderStatus)
router.delete('/:id',authMiddleWare,cancelOrder)

export default router