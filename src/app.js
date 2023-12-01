const express=require('express');
require("./db/conn");
const route=require("./routes/routes");
const {customer,Loan}=require("./db/models/Schema")

const app=express();

app.use(express.json())

app.use(route);


app.get("/",(req,res)=>{
    res.send("hello from the server side")
})

const PORT=process.env.PORT||3000

app.listen(PORT, () => console.log('Server running on port 3000'));