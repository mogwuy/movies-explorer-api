const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorValidator = require('./api/errorValidator');
const NotFoundError = require('./errors/not-found-error');

const app = express();
const { PORT = 3005, NODE_ENV, MONGODB } = process.env;

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? MONGODB : 'mongodb://localhost:27017/moviesdb', {
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
app.use(helmet());

app.use(require('./routes/auth'));

app.use(auth);

app.use(require('./routes/movies'));
app.use(require('./routes/users'));

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
