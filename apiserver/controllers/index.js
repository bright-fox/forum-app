import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import RefreshToken from "../models/refreshtoken";
import CustomError from "../util/CustomError";
import { checkValidationErrors, asyncHandler, generateIdToken, generateRefreshToken } from "../util";
import { validateRegister, validateLogin } from "../middlewares/validation";
import { authenticateIdToken } from "../middlewares/auth";

const router = express.Router();

//prettier-ignore
router.post("/register", validateRegister(), asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    const savedUser = await user.save();

    const payload = {id: savedUser._id, username: user.username};
    const idToken = generateIdToken(payload);
    const refreshToken = await generateRefreshToken(payload, savedUser._id);
    res.status(200).json({user: savedUser, idToken, refreshToken: refreshToken});
  }));

//prettier-ignore
router.post("/login", validateLogin(), asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { username, password } = req.body;
  
    const user = await User.findOne({username}).exec();
    if(!user) throw new CustomError(403);
  
    const passwordValid = await bcrypt.compare(password, user.password);
    if(!passwordValid) throw new CustomError(403);

    const payload = { id: user._id, username: user.username};
    const idToken = generateIdToken(payload);
    const refreshToken = await generateRefreshToken(payload, user._id);
    res.status(200).json({ idToken, refreshToken });
  }));

// prettier-ignore
router.get("/secret", authenticateIdToken, asyncHandler(async (req, res) => {
  res.status(200).json({message: "I am a secret message"});
}));

// prettier-ignore
router.post("/token", asyncHandler(async (req, res) => {
  const { refreshToken } = req.body; 
  if(!refreshToken) throw new CustomError(400, "No token passed");

  const foundToken = await RefreshToken.findOne({ token: refreshToken }).exec();
  if(!foundToken) throw new CustomError(401, "Token is not in the whitelist");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) throw new CustomError(401, "The token is expired or invalid");
    const idToken = generateIdToken({id: user.id, username: user.username});
    res.status(200).json({ idToken });
  })
}));

export default router;