import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app=express()
const PORT=process.env.PORT||5178
import authRoutes from './routes/auth.routes'
import bookRouters from './routes/books.routes'
import categoriesRoutes from './routes/categories.routes'
import cartRoutes from './routes/cart.routes'
import ordersRoutes from './routes/orders.routes'
import reviewsRoutes from './routes/reviews.routes'
import favoritesRoutes from './routes/favorites.routes'

app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/books',bookRouters)
app.use('/api/categories',categoriesRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/orders',ordersRoutes)
app.use('/api/reviews',reviewsRoutes)
app.use('/api/favorites',favoritesRoutes)

//get запросы
app.get('/',(req:Request,res:Response)=>{
    
})

//запуск сервера
app.listen(PORT,()=>{
    console.log(`THE SERVER IS RUNNING ON http://localhost:${PORT}`)
})