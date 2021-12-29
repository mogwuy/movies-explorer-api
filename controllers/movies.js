const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ValidationError = require('../errors/validation-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN, moveId,
  } = req.body;
  Movie.create({
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN, moveId, owner: req.user._id,
  })
    .then((data) => {
      Movie.findById(data._id)
        .orFail(() => { throw new NotFoundError('Запрашиваемые данные не найдены'); })
        .populate('owner')
        .then((movie) => {
          res.send(movie);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => { throw new NotFoundError('Запрашиваемые данные не найдены'); })
    .then((data) => {
      const ownerId = data.owner;
      const owner = ownerId.toString();
      if (req.user._id === owner) {
        data.remove()
          .then(() => {
            res.send({ message: 'Успешно удалено' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
    })
    .catch(next);
};
