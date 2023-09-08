import express from "express";
import colors from "colors";   // only used to make console colored 
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import cors from "cors";

//configure env  ==> makes api , port number etc secure so no one can easily access them
dotenv.config();


// database config
connectDB();

// rest object
const app = express();

//middlewares => feature of express
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use("/api/v1/auth",authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);




//rest api
app.get("/", (req,res)=>{
    res.send("<h1> welcome to Ebasket </h1>");
});

//port
 const PORT = process.env.PORT || 8080; // optionally || declared 8080 if there is any issue in env file

 //run listen
 app.listen(PORT, () =>{
    console.log(`server running on ${PORT}`);           // use `` to make it dynamic
 });