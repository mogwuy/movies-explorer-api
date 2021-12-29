require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MongoServerError = require('../errors/mongoserver-error');
const ValidationError = require('../errors/validation-error');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => {
      res
        .status(200)
        .send({
          data: {
            name, email,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new MongoServerError('Данная почта уже используется'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, path: '/' })
        .send({ message: 'Авторизация успешна' })
        .end();
    })
    .catch(next);
};

module.exports.clearCookie = (req, res, next) => {
  if (req) {
    return res
      .clearCookie('jwt', { path: '/' })
      .send({ message: 'Вы успешно разлогинились' })
      .end();
  }
  return next();
};
