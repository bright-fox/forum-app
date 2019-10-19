class CustomError extends Error {
  constructor(statusCode, message) {
    super(message || "Ooops, something went wrong!");
    this.status = statusCode || 500;
  }
}

export default CustomError;
