import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

const JWT_PASSWORD = "!123123";

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
    const Token = jwt.sign(
      {
        id: existingUser._id, // the user id in inlcuded the inside the token
      },
      JWT_PASSWORD   //secret key to sign 
    );
  }
});
// app.post("/api/v1/content",(req,res) => {

// })
// app.get("/api/v1/content",(req,res) => {

// })
// app.delete("api/v1/content",(req,res) => {

// })
// app.get("api/v1/brain/:shareLink" ,(req,res) => {

// })
app.listen(3000);
