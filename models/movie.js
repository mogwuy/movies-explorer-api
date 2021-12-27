const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

// Схема Карточки
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 4,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 240,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 120,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 120,
  },
});
// Модель Карточки
module.exports = mongoose.model('movie', movieSchema);
