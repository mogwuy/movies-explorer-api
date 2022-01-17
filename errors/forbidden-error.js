const Errors = require('../constants/error');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Errors.CODE_403;
  }
}

module.exports = ForbiddenError;
