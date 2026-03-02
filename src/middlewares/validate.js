const { creerErreur } = require('../utils/httpError');
const messagesMiddlewares = require('../messages/messages.middlewares');
const HTTP_STATUS = require('../messages/httpStatus');


const valider = (schema, source = 'body') => {
  return (req, res, next) => {
    const donnees = req[source];
    const { error, value } = schema.validate(donnees, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(
        creerErreur(HTTP_STATUS.BAD_REQUEST, messagesMiddlewares.validate.donneesInvalides, details)
      );
    }

    req[source] = value;
    next();
  };
};

module.exports = valider;
