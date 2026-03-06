import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/database';
import cors from "cors";
import authRoutes from './routes/authRoutes'
import hedgeRoutes from './routes/hedgeRoutes'
import contractRoutes from './routes/contractsRoutes'
import farmerRoutes from './routes/farmerRoutes'
import pinRoutes from './routes/pinRoutes'
 
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

dbConnect()

//middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://connect-pro-rust.vercel.app",
    "https://connect-pro-9z7w.vercel.app"
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
  
        if (!origin) return callback(null, true);
  
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
  
        return callback(new Error("CORS Blocked"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
    })
  );
  
 
app.use(express.json());

//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/hedge',hedgeRoutes)
app.use('/api/v1/contracts',contractRoutes)
app.use('/api/v1/farmer',farmerRoutes)
app.use('/api/v1/pin',pinRoutes)

app.listen(PORT , ()=>{
    console.log(`Server is running at ${PORT} port number`)
})