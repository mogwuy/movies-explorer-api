const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(60),
    director: Joi.string().required().min(2).max(60),
    duration: Joi.string().required().min(2).max(4),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2).max(240),
    image: Joi.string().required().regex(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/),
    trailer: Joi.string().required().regex(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/),
    thumbnail: Joi.string().required().regex(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/),
    nameRU: Joi.string().required().min(2).max(120),
    nameEN: Joi.string().required().min(2).max(120),
  }),
}), createMovie);
moviesRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
