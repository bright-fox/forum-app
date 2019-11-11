import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import Refreshtoken from "../models/refreshtoken";
import CustomError from "../util/CustomError";

// async handler
export const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);

export const checkExistenceInDatabase = async (model, id) => {
  const doc = await model.findOne({ _id: id }).exec();
  if (doc) return true;
  throw new Error(`FK Constraint 'checkObjectsExists' for '${id.toString()}' failed`);
};

export const checkValidationErrors = req => {
  const errors = validationResult(req);
  return !errors.isEmpty();
};

// removes dependent documents which also triggers the remove hooks (mongoose)
// DOES THIS WORK???
export const removeDependentDocs = async (model, selector) => {
  const docs = await model.find(selector).exec();
  docs.forEach(async doc => await doc.remove());
};

export const updateParentField = async (model, id, incField, incValue) => {
  const doc = await model.findById(id).exec();
  if (!doc) throw new CustomError(404);
  doc[incField] += incValue;
  if (doc[incField] < 0) throw new CustomError(400, "IT IS UNDER 0");
  await doc.save();
};

export const generateIdToken = payload => {
  return jwt.sign(payload, process.env.ID_TOKEN_SECRET, { expiresIn: "5m" });
};

export const generateRefreshToken = async (payload, userId) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  const refreshToken = new Refreshtoken({ token, user: userId });
  await refreshToken.save();
  return token;
};

// auth middleware utility

export const checkDocOwnership = async (req, model, docId, userId, fieldName) => {
  const doc = await model.findById(docId).exec();
  if (!doc) throw new CustomError(404);
  if (!doc[fieldName].equals(userId)) throw new CustomError(403);
  req.doc = doc;
};
