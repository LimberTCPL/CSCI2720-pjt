import express, { application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const app = express();
app.use(cookieParser());
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        method: ["POST, GET"],
        credentials: true
}
));
app.use(express.json());

// mongoose needs to be installed with npm
//const mongoose = require('mongoose');
// put your database link here
mongoose.connect('mongodb://localhost:27017/myDatabase'); //if localhost doesn't connect, try 127.0.0.1

// mongoose.connection is an instance of the connected DB
const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
console.log("Connection is open...");
// your code here if the connection is open
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    context: {type: String, required: true},
    user: {type: String, required: true},
    date: {type: String, requred: true}
})
const Comment = mongoose.model("Comment", CommentSchema);

app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    const username = req.body.username;
    const date = req.body.date;
    const newComment = new Comment({
        context: comment,
        user: username,
        date: date
    })
    
    newComment.save()
    .then(() => {
        res.status(201);
    })
})



/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/

app.get('/',(req, res, next) => {
    //console.log('verify')
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, "loginkey", (err, decode) =>{
            if (err){
                return res.json({Message: "err"})
            }else{
                req.name = decode.name;
                next();
            }
        })    
    } else {
        return res.json=({Message: "need verify"})
        }
    }, (req, res) =>{
    return res.json({Status : "Login", name: req.name})
})
    

app.get('/Logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Logout"})
})


app.post('/Login', (req, res) => {
    const id = req.body.loginID, pwd = req.body.loginpwd;
    if(id== "admin" && pwd== "admin"){
        const name = id;
        const accessToken = jwt.sign(
            {"UserInfo":{
                "username": name,
                "roles": roles
            }}, 
            proccess.env.ACCESS_TOKEN_SERECT,
            {expiresIn: '1d'});
        res.cookie('token', token);
        return res.json({Status: "Login"})
    } else {
        return res.json({Message: id + ' ' + pwd})
    }
})
})
app.listen(8081, ()=>{
    console.log("running")
})
