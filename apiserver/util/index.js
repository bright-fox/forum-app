import CustomError from "../util/CustomError";
import { validationResult } from "express-validator";

// async handler
export const asyncHandler = fn => (req, res, next) =>
  fn(req, res, next).catch(next);

export const checkExistenceInDatabase = (model, id) => {
  return new Promise((resolve, reject) => {
    model.findOne({ _id: id }, (err, doc) => {
      if (doc) {
        return resolve(true);
      }
      return reject(
        new Error(
          `FK Constraint 'checkObjectsExists' for '${id.toString()}' failed`
        )
      );
    });
  });
};

export const checkValidationErrors = req => {
  const errors = validationResult(req);
  return !errors.isEmpty();
};

// removes dependent documents which also triggers the remove hooks (mongoose)
export const removeDependentDocs = (model, selector) => {
  model.find(selector, (err, docs) => {
    if (err) throw err;
    docs.forEach(doc => {
      doc.remove(err => {
        if (err) throw err;
      });
    });
  });
};

export const updateParentField = (model, id, incOption) => {
  model.findOneAndUpdate({ _id: id }, { $inc: incOption }, err => {
    if (err) throw err;
  });
};
