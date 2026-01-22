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
    "/login", function(req, res, next){
        passport.authenticate(
            "local", 
            { 
            //    successRedirect: "/secrets",
            //    failureRedirect: "/login",
                session:true
            },
            function(err, user, info, status){
                if(err){
                    return res.send(err);
                    //return res.redirect("/login");
                }
                
                if(!user){
                    return res.send(info);
                    //return res.redirect("/login");
                }
                //return res.send(user);
                console.log("inside authenticate callback");
                console.log(req.session);
                req.session["passport"] = {user:user};

                return res.redirect("/secrets");

            }
        )(req, res, next);
    }
);

app.get("/secrets", (req, res) =>{
    console.log("inside /secrets");
    console.log(req.isAuthenticated());
    console.log(req.session);
    console.log(req.user);
   return res.send("This is secrets page. Access this page after login");
});

app.listen(PORT, () => 
    console.log(`start listening to port ${PORT}`)
);


const user = {id: 1, name: "Tom", password:"123456"};

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
            const userCredentials = getUserInfo(username);
            if(!userCredentials)
                return cb(null, false, { message:"User does not exist"});
            if(password === userCredentials.password){
                const userInfo = {};
                userInfo.name = userCredentials.name;
                userInfo.id = userCredentials.id;
                //only provide the necessary info to callback function
                return cb(null, userInfo);
            }

            //return cb(null, false, {message: "incorrect password"});
            return cb("intend error", false, {message: "throw error intendedly"});
        }
    )
);


passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
