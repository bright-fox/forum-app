import CustomError from "../util/CustomError";
import { validationResult } from "express-validator";

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
