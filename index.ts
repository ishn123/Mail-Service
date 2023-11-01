import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User,Board,Cards } from './documents';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from "passport-local"
import bodyParser from "body-parser";
import cors from "cors";
import { sign } from 'crypto';
import signature from "cookie-signature";





dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors({credentials:true}));
const authUser = async(username:String,password:String,done:Function)=>{
  await User.findOne({email:username,password:password})
        .then((res)=>
          done(null,res)
        )
        .catch((err)=>{
          done(null,false);
        });

}

app.use(bodyParser.json());
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,

}));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy.Strategy(authUser));

passport.serializeUser((user:any, done)=>{
 
  done(null,user?._id);
  
})

passport.deserializeUser((userObj:any, done) => {
  console.log("userobj",userObj);
  
  done (null, userObj )
})


app.get("/fail",(req,res)=>{
 
  res.sendStatus(501);
  
})
app.post("/fail",(req,res)=>{
 
  res.sendStatus(501);
  
})
app.post('/succ',(req,res)=>{
  
  console.log("Logged in sucess");
  res.status(201).json({userid:req.user}).send();
  
})
app.post('/signin',passport.authenticate('local',{
  successMessage:"Logged in Success",
  failureMessage:"Failed to login",
  failureRedirect:"/fail"
}),(req,res)=>{
 
  res.status(201).json({userid:req.user}).send();
});


app.put("/update/:id",async(req,res)=>{
  const userid = req.params.id;
  console.log(req.body);
  
  const data = req.body;

  await User.findByIdAndUpdate(userid,{boards:data})
            .then((resp)=>{
              console.log(resp);
              req.logOut(()=>console.log("error logging out"));
              res.sendStatus(201);
              
            })
            .catch((err)=>{
              console.log(err);
              res.status(501).send()
              
            });

  
});


app.post('/signup',async(req,res)=>{
  const board1 = {_id:Date.now() + Math.random() * 2,title:"To-do",cards:[]}
  const board2= {_id:Date.now() + Math.random() * 2,title:"In-Progress",cards:[]}
  const board3 = {_id:Date.now() + Math.random() * 2,title:"Done",cards:[]}
  
 
  const name = req.body.username;
  const pass = req.body.password;
  const email = req.body.email;
  const image = null;
  await User.create({email,password:pass,name,boards:[board1,board2,board3],image:image})
        .then((re)=>{
          res.status(201).json({userid:re.id})
        })
        .catch((err)=>res.status(404).send());
 
  
});


app.get("/getData/:id",async(req,res)=>{
 
  

    const userid = req.params.id;
 

    const data = await User.findOne({_id:userid});
    
    res.status(201).json(data?.boards).send();
  

 
});

app.post("/setImage/:id",async(req,res)=>{
  const uid = req.params.id;
  const url = req.body.url;
  await User.findByIdAndUpdate(uid,{image:url})
            .then((resp)=>{
              res.sendStatus(201);
            }).catch((err)=>{
              res.sendStatus(401);
            })
})

app.get("/getImage/:id",async(req,res)=>{
  const uid = req.params.id;
  await User.findById(uid)
            .then(resp=>res.status(201).json({url:resp?.image}).send())
            .catch((err)=>res.sendStatus(401));
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  mongoose.connect("mongodb+srv://labicons6:1tQCO5iQYOKQDNnS@cluster0.t1xpnv8.mongodb.net/?retryWrites=true&w=majority")
          .then((res)=>console.log("Connection sucessfull"))
          .catch((err)=>console.log("Error connecting DB........"));
          
});