class HttpError extends Error {
  constructor(statusCode, statusMessage, details) {
    super(`HttpError { statusCode: ${statusCode}, statusMessage: ${statusMessage}, details: ${details} }`);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.details = details;
  }

  static fromError(err) {
    if (err instanceof HttpError) return err;
    const httpError = new HttpError(500, 'Internal Server Error', err.message);
    httpError.stack = err.stack;
    return httpError;
  }
}

module.exports = HttpError;
