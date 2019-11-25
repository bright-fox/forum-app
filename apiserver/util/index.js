import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import Comment from "../models/comment";
import { validationResult } from "express-validator";

import Refreshtoken from "../models/refreshtoken";
import CustomError from "../util/CustomError";

// async handler
export const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);

export const checkValidationErrors = req => {
  const errors = validationResult(req);
  return !errors.isEmpty();
};

// removes dependent documents which also triggers the remove hooks (mongoose)
export const removeDependentDocs = async (model, selector) => {
  const docs = await model.find(selector).exec();
  docs.forEach(async doc => await doc.remove());
};

export const updateParentField = async (model, id, incField, incValue) => {
  const doc = await model.findById(id).exec();
  if (!doc) throw new CustomError(404);
  doc[incField] += incValue;
  if (doc[incField] < 0) throw new CustomError(400);
  const updatedDoc = await doc.save();
  return updatedDoc;
};

export const generateIdToken = payload => {
  return jwt.sign(payload, process.env.ID_TOKEN_SECRET, { expiresIn: "5m" });
};

export const generateRefreshToken = async (payload, userId) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  const refreshToken = new Refreshtoken({ token, user: userId });
  await refreshToken.save();
  return token;
};

// auth middleware utility

export const checkDocOwnership = async (req, model, docId, userId, fieldName) => {
  const doc = await model.findById(docId).exec();
  if (!doc) throw new CustomError(404);
  if (!doc[fieldName].equals(userId)) throw new CustomError(403);
  req.doc = doc;
};

export const checkPageUnderMax = async (model, selection, limit, p) => {
  const count = await model.estimatedDocumentCount(selection).exec();
  const maxPage = Math.ceil(count / limit);
  const isValid = p <= maxPage;
  if (!isValid) throw new CustomError(404);
  return maxPage.toString();
};

export const unescapeDocs = (docs, ...fields) => {
  //console.log(docs, typeof docs);
  if (docs instanceof Array) {
    const unescapedDocs = docs.map(doc => {
      fields.forEach(field => {
        doc[field] = validator.unescape(doc[field]);
      });
      return doc;
    });
    return unescapedDocs;
  }
  fields.forEach(field => {
    docs[field] = validator.unescape(docs[field]);
  });
  return docs;
};

export const makeHash = obj => {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(obj));
  return hash.digest("hex");
};

export const isSpam = async (model, hash) => {
  return await model.exists({ hash });
};

export const getNestedComments = async comments => {
  if (comments.length === 0) return comments;

  return comments.reduce(async (prevPromise, comment) => {
    const collection = await prevPromise;

    comment.replies = await Comment.find({ post: comment.post, replyTo: comment._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    await getNestedComments(comment.replies);
    if (comment.replyTo === undefined) collection.push(comment);
    return collection;
  }, Promise.resolve([]));
};
