import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import {Strategy} from "passport-local";
import session from "express-session";

const app = express();

const PORT = 6000;

app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'you should keep this in secret',
  resave: false,
  saveUninitialized: false,
}));

app.get("/login", (req, res) =>{
    let msg;

    console.log(req.session);
    if(req.session?.messages?.length > 0){
        msg = req.session.messages[0];
        req.session.messages = [];
        return res.send(msg);
    }

    return res.send("this is login page. Don't need authentication");
});

app.post(
    "/login", 
    passport.authenticate(
        "local",
        {
            successRedirect: "/secrets",
            failureRedirect: "/login",
            failureMessage: true,
            session:false
        }
    )
);

app.get("/secrets", (req, res) =>{
    console.log(req.session);
    return res.send("This is secrets page. Access this page after login");
});

app.listen(PORT, () => 
    console.log(`start listening to port ${PORT}`)
);


const user = {name: "Tom", password:"123456"};

function getUserInfo(username){
    if(username === user.name)
        return user;
    return null;
}

passport.use(
    "local", 
    new Strategy(
        {usernameField: "username", passwordField:"password"}, 
        function verify(username, password, cb){
            try{
                const userCredentials = getUserInfo(username);
                if(!userCredentials)
                    return cb(null, false, { message:"User does not exist"});
                if(password === userCredentials.password){
                    const userInfo = {};
                    userInfo.name = userCredentials.name;
                    //only provide the necessary info to callback function
                    return cb(null, userInfo, {message:"login sucess"});
                }

                return cb(null, false, {message: "incorrect password"});
            
            }catch(err){
                return cb(null, false, {message: "exception error ocurred on server"});
            }
        }
    )
);


