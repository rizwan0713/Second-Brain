declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

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
        id: existingUser._id, // the user id in inlcuded the inside the token (payload)
      },
      JWT_PASSWORD //secret key to sign
    );
    res.json({
      token,
    });
  } else {
    res.json(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const title = req.body.title;
  const type = req.body.type;

  // const tag = req.body.tag

  await ContentModel.create({
    link,
    type,
    title,

    userId: req.userId,
    tag: [],
  });

  res.json({
    message: "Content added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    userId: req.userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
          const existingLink = await LinkModel.findOne({
              userId: req.userId
          });

          if (existingLink) {
              res.json({
                  hash: existingLink.hash
              })
              return;
          }
          
          const hash = random(10);
          await LinkModel.create({
              userId: req.userId,
              hash: hash
          })

          res.json({
              hash
          })
  } else {
      await LinkModel.deleteOne({
          userId: req.userId
      });

      res.json({
          message: "Removed link"
      })
  }
})


app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
      hash
  });

  if (!link) {
      res.status(411).json({
          message: "Sorry incorrect input"
      })
      return;
  }
  // userId
  const content = await ContentModel.find({
      userId: link.userId
  })

  console.log(link);
  const user = await UserModel.findOne({
      _id: link.userId
  })

  if (!user) {
      res.status(411).json({
          message: "user not found, error should ideally not happen"
      })
      return;
  }

  res.json({
      username: user.username,
      content: content
  })

})
app.listen(3000);
