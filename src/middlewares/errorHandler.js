//permet de gérer les erreurs de manière centralisée dans l'application Express
const { HttpError } = require('../utils/httpError');
const messagesMiddlewares = require('../messages/messages.middlewares');
const HTTP_STATUS = require('../messages/httpStatus');

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(`${messagesMiddlewares.errorHandler.logPrefix} ${err.name}: ${err.message}`);

  // Erreur Prisma - violation de contrainte unique
  if (err.code === 'P2002') {
    const champ = err.meta?.target?.join(', ') || 'champ';
    return res.status(HTTP_STATUS.CONFLICT).json({
      succes: false,
      message: messagesMiddlewares.errorHandler.prisma.violationContrainteUnique(champ),
    });
  }

  // Erreur Prisma - enregistrement introuvable
  if (err.code === 'P2025') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      succes: false,
      message: err.meta?.cause || messagesMiddlewares.errorHandler.prisma.enregistrementIntrouvable,
    });
  }

  // Erreur Prisma - clé étrangère invalide
  if (err.code === 'P2003') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      succes: false,
      message: messagesMiddlewares.errorHandler.prisma.referenceInvalide,
    });
  }

  // Erreur HTTP personnalisée
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      succes: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Erreur de validation (ID invalide)
  if (err.message && err.message.includes(messagesMiddlewares.errorHandler.validation.indiceIdInvalide)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      succes: false,
      message: err.message,
    });
  }

  // Erreur générique
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    succes: false,
    message:
      process.env.NODE_ENV === 'production'
        ? messagesMiddlewares.errorHandler.prisma.erreurInterneServeur
        : err.message,
  });
};

module.exports = errorHandler;
