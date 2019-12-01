import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

import User from "../models/user";
import RefreshToken from "../models/refreshtoken";
import CustomError from "../util/CustomError";
import { checkValidationErrors, asyncHandler, generateIdToken, generateRefreshToken, unescapeDocs } from "../util";
import { validateRegister, validateLogin, validateRefreshToken } from "../middlewares/validation";
import { authenticateIdToken, authenticateRefreshToken } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  validateRegister(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { username, email, password, biography } = req.body;
    const user = new User({ username, email, password, biography });
    const savedUser = await user.save();

    const payload = { id: savedUser._id, username: user.username };
    const idToken = generateIdToken(payload);
    const refreshToken = await generateRefreshToken(payload, savedUser._id);
    res.status(200).json({
      success: "You successfully created an account!",
      user: _.omit(unescapeDocs(savedUser, "biography").toJSON(), "password", "email"),
      idToken,
      refreshToken
    });
  })
);

router.post(
  "/login",
  validateLogin(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { username, password } = req.body;

    const user = await User.findOne({ username })
      .select("+password")
      .exec();
    if (!user) throw new CustomError(404);

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new CustomError(403);

    const payload = { id: user._id, username: user.username };
    const idToken = generateIdToken(payload);
    const refreshToken = await generateRefreshToken(payload, user._id);
    res.status(200).json({ success: "You successfully logged in!", idToken, refreshToken });
  })
);

router.post(
  "/logout",
  validateRefreshToken(),
  authenticateRefreshToken,
  asyncHandler(async (req, res) => {
    await req.token.remove();
    res.status(200).json({ success: "You successfully logged out!" });
  })
);

router.post(
  "/token",
  validateRefreshToken(),
  authenticateRefreshToken,
  asyncHandler(async (req, res) => {
    const { id, username } = req.user;
    const idToken = generateIdToken({ id, username });
    res.status(200).json({ idToken });
  })
);

export default router;
