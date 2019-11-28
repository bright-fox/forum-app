import { body, param } from "express-validator";

// User validation

export const validateRegister = () => {
  return [
    body("username")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .isAlphanumeric(),
    body("email")
      .exists()
      .not()
      .isEmpty()
      .isEmail()
      .trim()
      .normalizeEmail(),
    body("password")
      .exists()
      .not()
      .isEmpty(),
    body("biography")
      .exists()
      .escape()
      .trim()
  ];
};

export const validateLogin = () => {
  return [
    body("username")
      .exists()
      .isAlphanumeric(),
    body("password").exists()
  ];
};

export const validateUser = () => {
  return [
    body("biography")
      .exists()
      .escape()
      .trim()
  ];
};

export const validatePassword = () => {
  return [
    body("oldPassword")
      .exists()
      .not()
      .isEmpty(),
    body("newPassword")
      .exists()
      .not()
      .isEmpty()
  ];
};

// Post validation

export const validatePost = () => {
  return [
    body("title")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("content")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .escape()
  ];
};

// Community validation

export const validateCommunity = () => {
  return [
    body("name")
      .exists()
      .not()
      .isEmpty()
      .isAlphanumeric()
      .trim(),
    body("description")
      .exists()
      .trim()
      .escape()
  ];
};

// Comment validation

export const validateComment = () => {
  return [
    body("content")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .escape()
  ];
};

// validate page
export const validatePage = () => {
  return [
    param("p")
      .isNumeric()
      .customSanitizer(v => {
        if (v <= 0) return 1;
        return v;
      })
  ];
};
