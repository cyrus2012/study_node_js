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

app.use(passport.authenticate('session'));


app.get("/login", (req, res) =>{
    return res.send("this is login page. Don't need authentication");
});

app.post(
    "/login", 
    passport.authenticate(
        "local", 
        {
            successRedirect: "/secrets",
            failureRedirect: "/login",
            //session:false
        }
    )
);

app.get("/secrets", (req, res) =>{
    
    return res.send("This is secrets page. User " + req.user?.id 
        + " name " + req.user?.name + " has access this route");
});

app.listen(PORT, () => 
    console.log(`start listening to port ${PORT}`)
);


const user = {id:1, name: "Tom", password:"123456"};

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
                    userInfo.id = userCredentials.id;
                    //only provide the necessary info to callback function
                    return cb(null, userInfo, {message: "login sucess"});
                }

                return cb(null, false, {message: "incorrect password"});

                //pass a string to 1st argument of cb function to see what will happend.
                //return cb("test of 1st arugment in Strategy cb function", false, {message: "intendedly set this error"});
            }catch(err){
                return cb(null, false, {message: "exception error ocurred when access database"});
            }
        }
    )
);


passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, name: user.name });
  });
});


passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});