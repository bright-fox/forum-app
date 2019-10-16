export const logError = (err, req, res, next) => {
  console.log(err.name, err.status || 500, err.message);
  next(err);
};

export const handleMongoError = (err, req, res, next) => {
  if (!err.name === "MongoError") return next(err);
  res.status(500).json({ status: 500, message: "Internal Server Error" });
};

export const handleError = (err, req, res, next) => {
  const newError = { status: err.status || 500, message: err.message };
  if (err.name === "CastError") newError.message = "Invalid ID";
  else if (err.name === "MongoError")
    newError.message = "Internal Server Error";
  res.status(newError.status).json(newError);
};
