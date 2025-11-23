import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/database';
import cors from "cors";
import authRoutes from './routes/authRoutes'
 
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

dbConnect()

//middlewares
app.use(cors())
app.use(express.json());

//routes
app.use('/api/v1/auth',authRoutes)


app.listen(PORT , ()=>{
    console.log(`Server is running at ${PORT} port number`)
})