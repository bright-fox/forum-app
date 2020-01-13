export const requiredMessage = field => ({ [field]: `${field} is required` });
export const minMessage = (field, min) => ({ [field]: `${field} must be higher than ${min - 1}` });
export const maxMessage = (field, max) => ({ [field]: `${field} must be lower than ${max + 1}` });
export const minLengthMessage = (field, min) => ({ [field]: `${field} should contain at least ${min} characters` });
export const maxLengthMessage = (field, max) => ({ [field]: `${field} should contain at most ${max} characters` });
export const betweenMessage = (field, min, max) => ({
  [field]: `${field} should contain at least ${min} and at most ${max} characters`
});
export const isAlphaMessage = field => ({ [field]: `${field} can only contain letters` });
export const isNumberMessage = field => ({ [field]: `${field} can only contain numbers` });
export const isAlphaNumericMessage = field => ({ [field]: `${field} can only contain letters and numbers` });
export const isEmailMessage = field => ({ [field]: `${field} is not a valid e-mail address` });
export const isInMessage = (field, array) => ({ [field]: `${field} is not contained in ${array.join(", ")}` });
