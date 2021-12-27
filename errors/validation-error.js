const Errors = require('../constants/error');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Errors.CODE_400;
  }
}

module.exports = ValidationError;
