const Errors = require('../constants/error');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Errors.CODE_404;
  }
}

module.exports = NotFoundError;
