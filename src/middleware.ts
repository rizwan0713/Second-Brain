import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_PASSWORD} from "./config"

export const userMiddleware = (req:Request, res:Response, next:NextFunction  ) =>{

//   const token = req.body.token || req.cookies.token || req.headers("authorization").replace("Bearer ", "");
 const header = req.headers["authorization"];
 const decoded = jwt.verify(header as string, JWT_PASSWORD) 
//  console.log("this is decoded token or header" ,decoded)
//  console.log("this is decoded id means existing user id token or header" ,decoded.id)

 if(decoded){
    //@ts-ignore
    req.userId = decoded.id;
    next()
 }
 else{
    res.status(403).json({
        message:"you rea not logged in"
    })
 }

}