import _ from "lodash";
import { required, isAlphaNumeric } from "../utils/validation";

export default (field, value, errors) => {
  switch (field) {
    case "username":
      if (required(value)) {
        return { ...errors, [field]: `${field} is required` };
      }
      if (!isAlphaNumeric(value)) {
        return { ...errors, [field]: `${field} can only contain letters and numbers` };
      }
      return _.omit(errors, [field]);

    case "password":
      if (required(value)) {
        return { ...errors, [field]: `${field} is required` };
      }
      if (value.length <= 8) {
        return { ...errors, [field]: `${field} should have at least 8 characters` };
      }
      return _.omit(errors, [field]);
    default:
      break;
  }
};
