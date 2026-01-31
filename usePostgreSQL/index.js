import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import {Strategy} from "passport-local";
import jwt from "jsonwebtoken";
import BearerStrategy from "passport-http-bearer";
import repository from "./repository.js";
import service from "./service.js";
import { isServicePermit, checkPermission, serviceA, serviceB, serviceC, serviceD } from "./service.js";

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
app.get("/api/secreta", async function (req, res, next){
    
    return await service["serviceA"](req, res);
});

app.get("/api/secretb", async function (req, res, next){
    
    return await service["serviceB"](req, res);
});

app.get("/api/secretc", async function (req, res, next){
    
    return await service["serviceC"](req, res);
});

app.get("/api/secretd", async function (req, res, next){
    
    return await service["serviceD"](req, res);
});

app.get("/api/testa", await checkPermission("serviceA"), function (req, res, next){

    return serviceA(req, res);
});

app.get("/api/testb", await checkPermission("serviceB"), function (req, res, next){

    return serviceB(req, res);
});

app.get("/api/testc", await checkPermission("serviceC"), function (req, res, next){

    return serviceC(req, res);
});

app.get("/api/testd", await checkPermission("serviceD"), function (req, res, next){

    return serviceD(req, res);
});


app.get("/api/test2a", async function (req, res, next){

    if(!await isServicePermit("serviceA", req.user?.id))
        return res.send(`${req.user?.name} do not have access right to service A`);
        
    return serviceA(req, res);

});

app.get("/api/test2b", async function (req, res, next){

    if(!await isServicePermit("serviceB", req.user?.id))
        return res.send(`${req.user?.name} do not have access right to service B`);
        
    return serviceB(req, res);

});

app.get("/api/test2c", async function (req, res, next){

    if(!await isServicePermit("serviceC", req.user?.id))
        return res.send(`${req.user?.name} do not have access right to service C`);
        
    return serviceC(req, res);

});

app.get("/api/test2d", async function (req, res, next){

    if(!await isServicePermit("serviceD", req.user?.id))
        return res.send(`${req.user?.name} do not have access right to service D`);
        
    return serviceD(req, res);

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
        async function verify(username, password, cb){
            const userCredentials = await repository.getUserInfoByName(username);
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
