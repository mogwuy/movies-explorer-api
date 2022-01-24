/* eslint-disable consistent-return */
// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://api.mogwuy-diplom.nomoredomains.rocks',
  'http://api.mogwuy-diplom.nomoredomains.rocks',
  'https://mogwuy-diplom.nomoredomains.rocks',
  'http://mogwuy-diplom.nomoredomains.rocks',
  'http://mogwuy-diplom.nomoredomains.rocks/movies',
  'https://mogwuy-diplom.nomoredomains.rocks/movies',
  'https://mogwuy-diplom.nomoredomains.rocks/saved-movies',
  'http://mogwuy-diplom.nomoredomains.rocks/saved-movies',
  'http://localhost:3005',
];

function cors(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', true);
    }
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
}

module.exports = {
  cors,
};
