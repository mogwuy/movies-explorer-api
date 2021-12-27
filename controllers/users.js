require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const MongoServerError = require('../errors/mongoserver-error');
const ValidationError = require('../errors/validation-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((data) => {
      res.send({
        name: data.name, email: data.email, _id: data._id,
      });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError('Запрашиваемые данные не найдены'); })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else { next(err); }
    });
};

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

// eslint-disable-next-line consistent-return
module.exports.clearCookie = (req, res, next) => {
  if (req) {
    return res
      .clearCookie('jwt', { path: '/' })
      .send({ message: 'Вы успешно разлогинились' })
      .end();
  }
  next();
};
