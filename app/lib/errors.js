class ResourceNotFound extends Error {
  constructor(message) {
    super(message);
    this.httpStatus = 404;
  }
}

module.exports = {
  ResourceNotFound,
};
