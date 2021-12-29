require('dotenv').config();
const jwt = require('jsonwebtoken');
const InvalidAutorization = require('../errors/invalid-autorization');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new InvalidAutorization('Необходима авторизация');
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return handleAuthError();
  }

  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  next();
};
