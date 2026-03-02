//helpers contient des fonctions utilitaires pour les services, comme la vérification d'existence ou d'unicité d'une ressource, qui peuvent être utilisées dans plusieurs services pour éviter la duplication de code
const { creerErreur } = require('./httpError');
const messagesUtils = require('../messages/messages.utils');
const HTTP_STATUS = require('../messages/httpStatus');

// methode pour vérifier l'existence d'une ressource, sinon lève une erreur 404
const verifierExistence = (ressource, nom, id) => {
  if (!ressource) {
    throw creerErreur(HTTP_STATUS.NOT_FOUND, messagesUtils.serviceHelpers.ressourceIntrouvable(nom, id));
  }
  return ressource;
};

// methode pour vérifier l'unicité d'une ressource, sinon lève une erreur 409
const verifierUnicite = (existant, champ, valeur) => {
  if (existant) {
    throw creerErreur(
      HTTP_STATUS.CONFLICT,
      messagesUtils.serviceHelpers.enregistrementExisteDeja(champ, valeur)
    );
  }
};

module.exports = { verifierExistence, verifierUnicite };
