export const required = val => val === "";
export const min = (val, min) => val >= min;
export const max = (val, max) => val <= max;
export const between = (val, min, max) => val > min && val < max;
export const isAlpha = val => /^[a-zA-Z]+$/.test(val);
export const isNumeric = val => /^[0-9]+$/.test(val);
export const isAlphaNumeric = val => /^[a-zA-Z0-9]+$/.test(val);
export const isEmail = val => /^[a-zA-Z0-9._+-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(val);
