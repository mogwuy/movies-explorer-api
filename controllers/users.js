require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const MongoServerError = require('../errors/mongoserver-error');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
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
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new MongoServerError('Данная почта уже используется'));
      } else { next(err); }
    });
};
