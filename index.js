const express = require('express');
const { resolve } = require('path');
const mongoose= require("mongoose");
const { 
  error } = require('console');
const dotenv=require("dotenv").config();


const app = express();
const port = 3010;
app.use(express.json());
app.use(express.static('static'));

mongoose
.connect(process.env.URL)
.then(()=>{
  console.log("Connected Successfully");
})
.catch((error)=>{
  console.log("Connection failed",error)
})

const menuItemSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
  },
  price:{
    type: Number,
    required:true
  }

})

const menuItem=mongoose.model("menuItem",menuItemSchema);
app.post("/menu",async(req,res)=>{
  const {name,description,price}=req.body;
  if(!name || !price)
  {
    res.status(400).json({message: "Please enter name and price"})
  }
  try{
    const menu= new menuItem({name,description,price});
    const saved = await menu.save();
    res.status(201).json({message:"Items successfully created"});
  }
  catch(error)
  {
    res.status(500).json({error: error.message})
  }
});

app.get("/menu",async(req,res)=>{
  try{
    const menu =await menuItem.find();
    res.status(200).json({menu});
  }
  catch(error)
  {
    res.status(500).json({message: "Failed to get menuItems", error: error.message});
  }
});



app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
