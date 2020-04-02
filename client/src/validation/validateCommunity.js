import _ from "lodash";
import { required, isAlphaNumeric } from "../utils/validation"
import { requiredMessage, isAlphaNumericMessage } from "../utils/validationMessage"

export default (field, value, errors) => {
    switch (field) {
        case "name":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            if (!isAlphaNumeric(value)) return { ...errors, ...isAlphaNumericMessage(field) };
            return _.omit(errors, [field])
        case "description":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            return _.omit(errors, [field]);
        default:
            return errors;
    }
};