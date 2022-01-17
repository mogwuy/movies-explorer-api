const Errors = require('../constants/error');

class MongoServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Errors.CODE_409;
    this.name = Errors.CODE_409;
  }
}

module.exports = MongoServerError;
