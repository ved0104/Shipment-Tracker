const express=require('express')
const app=express()
app.use(express.json());
const path=require('path')

const connectDB=require('./config/db') 
const shipmentRoutes=require('./routes/shipmentRoutes')
app.use(express.urlencoded({ extended: true }));
const cors=require('cors')
app.use(cors())
require('dotenv').config();
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

connectDB()
app.use('/api',shipmentRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));