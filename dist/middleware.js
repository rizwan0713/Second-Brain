"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    //   const token = req.body.token || req.cookies.token || req.headers("authorization").replace("Bearer ", "");
    const header = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_PASSWORD);
    //  console.log("this is decoded token or header" ,decoded)
    //  console.log("this is decoded id means existing user id token or header" ,decoded.id)
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "you are not logged in "
        });
    }
};
exports.userMiddleware = userMiddleware;
