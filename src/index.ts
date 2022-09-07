import express from "express";
import {devopsHeaders} from './utils/index';


const app=express();

app.get('/')
app.listen(3001,()=>{
    console.log('we are using typescript001')
    devopsHeaders({username:'nthangeni',pat:'7567rfchgjcchgc'})
})
