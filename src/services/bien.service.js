
const bienRepo = require('../repositories/bien.repo');
const agenceRepo = require('../repositories/agence.repo');
const messages = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const { HttpError } = require('../utils/httpError');

async function trouverTousBiens(filtres = {}) {
  return bienRepo.trouverTousBiens(filtres);
}

async function trouverBienParId(id) {
  const bien = await bienRepo.trouverBienParId(id);
  if (!bien) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messages.bien.nonTrouve);
  }
  return bien;
}

async function creerBien(donnees) {
  const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
  if (!agence) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.agence.idInexistant(donnees.agenceId));
  }
  return bienRepo.creer(donnees);
}

async function mettreAJourBien(id, donnees) {
  await trouverBienParId(id);
  if (donnees.agenceId) {
    const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
    if (!agence) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.agence.idInexistant(donnees.agenceId));
    }
  }
  return bienRepo.mettreAJour(id, donnees);
}

async function supprimerBien(id) {
  await trouverBienParId(id);
  const aDesVisites = await bienRepo.bienADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messages.bien.suppressionImpossibleVisites);
  }
  return bienRepo.supprimer(id);
}

async function archiverBien(id) {
  await trouverBienParId(id);
  return bienRepo.archiverBien(id);
}

async function bienADesVisites(id) {
  return bienRepo.bienADesVisites(id);
}

async function bienEstVisitable(id) {
  return bienRepo.bienEstVisitable(id);
}

async function cataloguePublic(filtres = {}) {
  return bienRepo.trouverTousBiens({ ...filtres, catalogue: true });
}

module.exports = {
  trouverTousBiens,
  trouverBienParId,
  creerBien,
  mettreAJourBien,
  supprimerBien,
  archiverBien,
  bienADesVisites,
  bienEstVisitable,
  cataloguePublic,
};
