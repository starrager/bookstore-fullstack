import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app=express()
const PORT=process.env.PORT||5178
import authRoutes from './routes/auth.routes'

app.use(express.json())
app.use(cors())
app.use('/api/auth',authRoutes)

//get запросы
app.get('/',(req:Request,res:Response)=>{
    
})

//запуск сервера
app.listen(PORT,()=>{
    console.log(`THE SERVER IS RUNNING ON http://localhost:${PORT}`)
})