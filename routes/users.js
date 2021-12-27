const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, updateUser, clearCookie,
} = require('../controllers/users');

usersRouter.get('/me', getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

usersRouter.post('/signout', clearCookie);

module.exports = usersRouter;
