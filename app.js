const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const {
  login, createUser,
} = require('./controllers/users');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorValidator = require('./api/errorValidator');
const NotFoundError = require('./errors/not-found-error');

const app = express();
const { PORT = 3000 } = process.env;

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    console.log(`Not connected to db ${err}`);
  } else {
    console.log('Successfully connected to db');
  }
});

app.use(requestLogger); // подключаем логгер запросов

app.use(cors);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/movies', require('./routes/movies'));
app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorValidator);

// Слушаем порт
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
