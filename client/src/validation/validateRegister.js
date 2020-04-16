import _ from "lodash";
import { required, isAlphaNumeric, isEmail, isIn, minLength } from "../utils/validation";
import {
  requiredMessage,
  isAlphaNumericMessage,
  isEmailMessage,
  isInMessage,
  minLengthMessage
} from "../utils/validationMessage";

const genders = ["male", "female", "others"];
const minPasswordLength = 8;

export default (field, value, errors) => {
  switch (field) {
    case "username":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!isAlphaNumeric(value)) return { ...errors, ...isAlphaNumericMessage(field) };
      return _.omit(errors, [field]);
    case "email":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!isEmail(value)) return { ...errors, ...isEmailMessage(field) };
      return _.omit(errors, [field]);
    case "emailConfirm":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!isEmail(value)) return { ...errors, ...isEmailMessage(field) };
      return _.omit(errors, [field]);
    case "password":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!minLength(value, minPasswordLength)) return { ...errors, ...minLengthMessage(field, minPasswordLength) };
      return _.omit(errors, [field]);
    case "passwordConfirm":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!minLength(value, minPasswordLength)) return { ...errors, ...minLengthMessage(field, minPasswordLength) };
      return _.omit(errors, [field]);
    case "gender":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!isIn(value, genders)) return { ...errors, ...isInMessage(field, genders) };
      return _.omit(errors, [field]);
    default:
      return errors;
  }
};
