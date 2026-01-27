import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import {Strategy} from "passport-local";
import jwt from "jsonwebtoken";
import BearerStrategy from "passport-http-bearer";
import repository from "./repository.js";
import service from "./service.js";

const app = express();

const PORT = 6000;

const jwtOption = {
    expiresIn: 86400, // = 24 * 60 * 60 seconds
};

const jwtSecretKey = "You should keep secret key in confidential";


app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

app.get("/login", (req, res) =>{
    return res.send("this is login page. Don't need authentication");
});

app.post(
    "/login", function(req, res, next){
        passport.authenticate(
            "local", 
            { session:false },
            function(err, user, info, status){
                if(err){
                    return res.send(err);
                }
                
                if(!user){
                    return res.send(info);
                }
                
                jwt.sign(user, jwtSecretKey, jwtOption, function(err, token){
                    if(err)
                        return res.send(err);

                    return res.send("Bearer " + token);
                });
                
            }
        )(req, res, next);
    }
);


app.use("/api/{*splat}", passport.authenticate("bearer", {session:false}));
app.get("/api/secreta", function (req, res, next){
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    //return res.send("This is protected api/secrets page.");

    return service["serviceA"](req, res);
});

app.get("/api/secretb", function (req, res, next){
    
    return service["serviceB"](req, res);
});

app.get("/api/secretc", function (req, res, next){
    
    return service["serviceC"](req, res);
});

app.get("/api/secretd", function (req, res, next){
    
    return service["serviceD"](req, res);
});


function tokenAuthenticate(req, res, next){
     passport.authenticate("bearer", function(error, decodedData, info){
        if(error)
            return res.send(error);

        if(!decodedData)
            return res.send("no decoded Data");

        req.user = decodedData;
        //return res.send(decodedData);
        next();
    })(req, res, next);
}

app.use("/apicustom/{*splat}", tokenAuthenticate);
app.get("/apicustom/secrets", function (req, res, next){
    console.log(req.user);
    console.log(req.isAuthenticated());
    return res.send("This is protected apicustom/secrets page.");

});


app.listen(PORT, () => 
    console.log(`start listening to port ${PORT}`)
);



passport.use(
    "local", 
    new Strategy(
        {usernameField: "username", passwordField:"password"}, 
        function verify(username, password, cb){
            const userCredentials = repository.getUserInfoByName(username);
            if(!userCredentials)
                return cb(null, false, { message:"User does not exist"});
            if(password === userCredentials.password){
                const userInfo = {};
                userInfo.name = userCredentials.name;
                userInfo.id = userCredentials.id;
                //only provide the necessary info to callback function
                return cb(null, userInfo);
            }

            return cb(null, false, {message: "incorrect password"});

        }
    )
);


passport.use(
    "bearer", 
    new BearerStrategy((token, cb) => {
        jwt.verify(token, jwtSecretKey, function(err, decode){
            if(err)
                return cb("error in token auth: " + err.message);

            return cb(null, decode, "decode result");
        });
            
    })
);
