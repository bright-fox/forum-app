import CustomError from "../util/CustomError";
import { validationResult } from "express-validator";

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
  docs.forEach(doc => await doc.remove());
};

export const updateParentField = async (model, id, incOption) => {
  await model.findOneAndUpdate({ _id: id }, { $inc: incOption });
};
