import { body } from "express-validator";

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

export const validateUser = () => {
  return [
    body("username")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .isAlphanumeric(),
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

export const validateCreatePost = () => {
  return [
    body("title")
      .trim()
      .escape(),
    body("content")
      .trim()
      .escape()
  ];
};

export const validateUpdatePost = () => {
  return [
    body("title")
      .optional()
      .trim()
      .escape(),
    body("content")
      .optional()
      .trim()
      .escape()
  ];
};

// Community validation

export const validateCreateCommunity = () => {
  return [
    body("name")
      .trim()
      .isAlphanumeric(),
    body("description")
      .trim()
      .escape()
  ];
};

export const validateUpdateCommunity = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isAlphanumeric(),
    body("description")
      .optional()
      .trim()
      .escape()
  ];
};

// Comment validation

export const validateCreateComment = () => {
  return [
    body("content")
      .trim()
      .escape()
  ];
};

export const validateUpdateComment = () => {
  return [
    body("content")
      .optional()
      .trim()
      .escape()
  ];
};

// Login validation
export const validateLogin = () => {
  return [
    body("username")
      .exists()
      .isAlphanumeric(),
    body("password").exists()
  ];
};
