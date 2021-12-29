const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(60),
    director: Joi.string().required().min(2).max(60),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(2).max(240),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле trailer заполнено некорректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail: заполнено некорректно');
    }),
    nameRU: Joi.string().required().min(2).max(120),
    nameEN: Joi.string().required().min(2).max(120),
    moveId: Joi.number().required(),
  }),
}), createMovie);
moviesRouter.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
