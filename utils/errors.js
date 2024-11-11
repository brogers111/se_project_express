module.exports = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,

  getErrorMessage: (status) => {
    switch (status) {
      case 400:
        return "Invalid data provided";
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
