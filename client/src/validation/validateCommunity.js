import _ from "lodash";
import { required, isAlphaNumeric, maxLength } from "../utils/validation"
import { requiredMessage, isAlphaNumericMessage, maxLengthMessage } from "../utils/validationMessage"

export default (field, value, errors) => {
    const mx = 25;
    switch (field) {
        case "name":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            if (!isAlphaNumeric(value)) return { ...errors, ...isAlphaNumericMessage(field) };
            if (!maxLength(value, mx)) return { ...errors, ...maxLengthMessage(field, mx) };
            return _.omit(errors, [field])
        case "description":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            return _.omit(errors, [field]);
        default:
            return errors;
    }
};