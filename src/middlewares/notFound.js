const messagesMiddlewares = require('../messages/messages.middlewares');
const HTTP_STATUS = require('../messages/httpStatus');

const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    succes: false,
    message: messagesMiddlewares.notFound.routeIntrouvable(req.method, req.originalUrl),
  });
};

module.exports = notFound;
