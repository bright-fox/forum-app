import _ from "lodash";
import { required, isAlphaNumeric, minLength } from "../utils/validation";
import { requiredMessage, isAlphaNumericMessage, minLengthMessage } from "../utils/validationMessage";

const minPasswordLength = 8;

export default (field, value, errors) => {
  switch (field) {
    case "username":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!isAlphaNumeric(value)) return { ...errors, ...isAlphaNumericMessage(field) };
      return _.omit(errors, [field]);
    case "password":
      if (required(value)) return { ...errors, ...requiredMessage(field) };
      if (!minLength(value, minPasswordLength)) return { ...errors, ...minLengthMessage(field, minPasswordLength) };
      return _.omit(errors, [field]);
    default:
      return errors;
  }
};
