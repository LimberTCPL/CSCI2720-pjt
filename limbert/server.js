import express, { application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

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

/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/
//verify the login state
app.get('/',(req, res, next) => {
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, "loginkey", (err, decode) =>{  //midleware for checking admin/user(implement later)
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
    return res.json({Status : "Login", req.name})
})
    
//get method to delete cookie for logout
app.get('/Logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Logout"})
})

//post method to get login state(implement mongodb later)
app.post('/Login', (req, res) => {
    const id = req.body.loginID, pwd = req.body.loginpwd;
    if(id== "admin" && pwd== "admin"){
        const name = id;
        const token = jwt.sign({name}, "loginkey", {expiresIn: '1d'});//setup jwt sign for user/admin seprately?
        res.cookie('token', token);//return cookie(distinguish admin/user?)
        return res.json({Status: "Login"})
    } else {
        return res.json({Message: id + ' ' + pwd})
    }
})

app.listen(8081, ()=>{
    console.log("running")
})
