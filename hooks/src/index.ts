import express from "express";

const app = express();

app.post('/hooks/catc/:userid/:zapid',(req,res)=>{
    const userid = req.params.userid;
    const zapid = req.params.zapid;
    
})