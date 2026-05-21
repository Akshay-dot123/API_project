const express=require('express');
const app=express();
// const cors=require('cors');
const mongoose=require("mongoose");
const cors=require("cors");
require('dotenv').config();

// Below 2 lines are enough to import collections.
const userRoutes=require("./routes/userRoutes");
const productRoutes=require("./routes/productRoutes");
app.use(express.json()); //This is used to parse JSON data from request body to Js object, without this we will get undefined when we try to access req.body
app.use(cors());

// Even this can be used to import collections in DB
// const fs = require("fs");
// const path = require("path");
// const modelsPath = path.join(__dirname, "models");
// fs.readdirSync(modelsPath).forEach(file => { // Loads every file in models folder and executes it, so that we don't have to manually import every model file
//    require(path.join(modelsPath, file));
// });

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB",err);
});

app.use('/user',userRoutes);
app.use('/product',productRoutes);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})