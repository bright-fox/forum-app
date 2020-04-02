export const logError = (err, req, res, next) => {
  console.log("\t", err.name, err.status || 500, err.message);
  next(err);
};

export const handleMongoError = (err, req, res, next) => {
  if (err.name === "CastError") return res.status(500).json({ status: 500, message: "The ID is invalid" });
  if (err.code === 11000)
    return res.status(409).json({
      status: 409,
      message: "Duplicate Key Error"
    });
  if (err.name === "MongoError") return res.status(500).json({ status: 500, message: "Internal Server Error" });
  next(err);
};

export const handleError = (err, req, res, next) => {
  res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
};
