import express from "express";
import bodyParser from "body-parser";
import session from "express-session";



const PORT = 8123;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(
  session({
    secret: "test-key",
    resave: false,
    saveUninitialized: true,
  })
);


app.get("/", (req, res, next) => {
    console.log(req.session);
    console.log(req.sessionID);
    return res.send("receive request");
});


app.get("/update", (req, res, next) => {
    
    console.log(req.session);
    console.log(req.sessionID);
    console.log("modify session");
    req.session.custom = {message:"this is modified by user"};
    console.log(req.session);
    console.log(req.sessionID);
    return res.send("modify session");
});

app.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
});