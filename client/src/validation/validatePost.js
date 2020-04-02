import _ from "lodash"
import { required, isId } from "../utils/validation";
import { requiredMessage, isIdMessage } from "../utils/validationMessage";

export default (field, value, errors) => {
    switch (field) {
        case "community":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            if (!isId(value)) return { ...errors, ...isIdMessage(field) }
            return _.omit(errors, [field])
        case "title":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            return _.omit(errors, [field])
        case "content":
            if (required(value)) return { ...errors, ...requiredMessage(field) };
            return _.omit(errors, [field])
        default:
            return errors;
    }
}