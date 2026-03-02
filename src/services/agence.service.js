
const agenceRepo = require('../repositories/agence.repo');
const messages = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const { HttpError } = require('../utils/httpError');

async function trouverToutesAgences() {
  return agenceRepo.trouverToutesAgences();
}

async function trouverAgenceParId(id) {
  const agence = await agenceRepo.trouverAgenceParId(id);
  if (!agence) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messages.agence.nonTrouvee);
  }
  return agence;
}

async function trouverAgenceParCode(code) {
  return agenceRepo.trouverAgenceParCode(code);
}

async function creerAgence(donnees) {
  const existant = await agenceRepo.trouverAgenceParCode(donnees.code);
  if (existant) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messages.agence.codeExisteDeja(donnees.code));
  }
  return agenceRepo.creer(donnees);
}

async function mettreAJourAgence(id, donnees) {
  await trouverAgenceParId(id);
  if (donnees.code) {
    const existant = await agenceRepo.trouverAgenceParCode(donnees.code);
    if (existant && existant.id !== parseInt(id)) {
      throw new HttpError(HTTP_STATUS.CONFLICT, messages.agence.codeExisteDeja(donnees.code));
    }
  }
  return agenceRepo.mettreAJour(id, donnees);
}

async function supprimerAgence(id) {
  await trouverAgenceParId(id);
  const { aDesRelations, clients, biens } = await agenceRepo.agenceADesRelations(id);
  if (aDesRelations) {
    throw new HttpError(
      HTTP_STATUS.CONFLICT,
      messages.agence.suppressionImpossibleRelations(clients, biens)
    );
  }
  return agenceRepo.supprimer(id);
}

async function agenceADesRelations(id) {
  return agenceRepo.agenceADesRelations(id);
}

module.exports = {
  trouverToutesAgences,
  trouverAgenceParId,
  trouverAgenceParCode,
  creerAgence,
  mettreAJourAgence,
  supprimerAgence,
  agenceADesRelations,
};
