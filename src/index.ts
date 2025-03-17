import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import {JWT_PASSWORD} from "./config"
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  //zod validation and hash passwoprd
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });
    res.status(200).json({
      message: "User signed up",
    });
  } catch (error) {
    res.status(401).json({
      message: "user already exist",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
    password,
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id, // the user id in inlcuded the inside the token
      },
      JWT_PASSWORD   //secret key to sign 
    );
    res.json({
        token
      
    })
  }
  else{
    res.json(403).json({
        message :"Incorrect Credentials"
    })
  }
});
//@ts-ignore
app.post("/api/v1/content", userMiddleware , async (req,res) => {


    const link = req.body.link
    const title = req.body.title
    const type = req.body.type

    // const tag = req.body.tag
    

    await ContentModel.create({
        link,
        type,
        title,

        //@ts-ignore
        userId:req.userId,
        tag:[]
    })

    return res.json({
        message:"Content added"
    })

})



app.get("/api/v1/content",userMiddleware,async(req,res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId","username")


})





app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        userId: req.
    })

    res.json({
        message: "Deleted"
    })
})
// app.get("api/v1/brain/:shareLink" ,(req,res) => {

// })
app.listen(3000);
