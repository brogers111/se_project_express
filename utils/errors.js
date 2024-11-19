module.exports = {
  BAD_REQUEST: 400,
  UNAUTHORIZED_ERROR_CODE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  DUPLICATE: 409,
  SERVER_ERROR: 500,

  getErrorMessage: (status) => {
    switch (status) {
      case 400:
        return "Invalid data provided";
      case 401:
        return "Authorization required";
      case 404:
        return "Requested resource not found";
      case 500:
        return "An error has occurred on the server";
      default:
        return "An unexpected error has occurred";
    }
  },

  handleError: (err, res, defaultStatus) => {
    console.error(err);
    const statusCode =
      err.statusCode || (err.name === "CastError" ? 400 : defaultStatus);
    const message = module.exports.getErrorMessage(statusCode);
    res.status(statusCode).send({ message });
  },

  throwNotFoundError: (message = "Resource not found") => {
    const error = new Error(message);
    error.statusCode = module.exports.NOT_FOUND;
    throw error;
  },
};
