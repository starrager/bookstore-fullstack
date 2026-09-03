import express,{NextFunction, Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from './logger'
import { logRequest } from './middleware/logger.middleware'

const app=express()
const PORT=parseInt(process.env.PORT||'5178',10)
import authRoutes from './routes/auth.routes'
import bookRouters from './routes/books.routes'
import categoriesRoutes from './routes/categories.routes'
import cartRoutes from './routes/cart.routes'
import ordersRoutes from './routes/orders.routes'
import reviewsRoutes from './routes/reviews.routes'
import favoritesRoutes from './routes/favorites.routes'
import userRoutes from './routes/users.routes'
import adminRoutes from './routes/admin.routes'

app.use(cors({
    origin: [
        'https://starrager-bookstore.surge.sh',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json())
app.use(logRequest)
app.use('/api/auth',authRoutes)
app.use('/api/books',bookRouters)
app.use('/api/categories',categoriesRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/orders',ordersRoutes)
app.use('/api/reviews',reviewsRoutes)
app.use('/api/favorites',favoritesRoutes)
app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)

app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    logger.error({
        message:err.message||'Unknown error',
        stack:err.stack,
        url:req.url,
        method:req.method,
        body:req.body,
        userId:req.userId,
        ip:req.ip,
    })
    res.status(err.status||500).json({
        error:err.message||'Internal server error'
    })
})

//get запросы
app.get('/',(req:Request,res:Response)=>{
    
})

export {app}

//запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`THE SERVER IS RUNNING ON http://0.0.0.0:${PORT}`)
})