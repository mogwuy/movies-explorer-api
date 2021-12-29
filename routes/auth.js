const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login, createUser, clearCookie,
} = require('../controllers/auth');

authRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

authRouter.post('/signout', clearCookie);

module.exports = authRouter;
