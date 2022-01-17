const Errors = require('../constants/error');

class InvalidAutorization extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Errors.CODE_401;
    this.name = Errors.CODE_401;
  }
}

module.exports = InvalidAutorization;
