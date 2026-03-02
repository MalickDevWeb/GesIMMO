
const clientRepo = require('../repositories/client.repo');
const agenceRepo = require('../repositories/agence.repo');
const messages = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const { HttpError } = require('../utils/httpError');

async function trouverTousClients(filtres = {}) {
  return clientRepo.trouverTousClients(filtres);
}

async function trouverClientParId(id) {
  const client = await clientRepo.trouverClientParId(id);
  if (!client) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messages.client.nonTrouve);
  }
  return client;
}

async function trouverClientParEmail(email) {
  return clientRepo.trouverClientParEmail(email);
}

async function trouverClientParTelephone(telephone) {
  return clientRepo.trouverClientParTelephone(telephone);
}

async function creerClient(donnees) {
  const existant = await clientRepo.trouverClientParEmail(donnees.email);
  const existantTel = await clientRepo.trouverClientParTelephone(donnees.telephone);
  if (existant) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messages.client.emailExisteDeja(donnees.email));
  }
  if (existantTel) {
    throw new HttpError(
      HTTP_STATUS.CONFLICT,
      messages.client.telephoneExisteDeja(donnees.telephone)
    );
  }
  const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
  if (!agence) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.agence.idInexistant(donnees.agenceId));
  }
  return clientRepo.creer(donnees);
}

async function mettreAJourClient(id, donnees) {
  await trouverClientParId(id);
  if (donnees.email) {
    const existant = await clientRepo.trouverClientParEmail(donnees.email);
    if (existant && existant.id !== parseInt(id)) {
      throw new HttpError(HTTP_STATUS.CONFLICT, messages.client.emailExisteDeja(donnees.email));
    }
  }
  if (donnees.agenceId) {
    const agence = await agenceRepo.trouverAgenceParId(donnees.agenceId);
    if (!agence) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.agence.idInexistant(donnees.agenceId));
    }
  }
  return clientRepo.mettreAJour(id, donnees);
}

async function supprimerClient(id) {
  await trouverClientParId(id);
  const aDesVisites = await clientRepo.clientADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messages.client.suppressionImpossibleVisites);
  }
  return clientRepo.supprimer(id);
}

async function clientADesVisites(id) {
  return clientRepo.clientADesVisites(id);
}

module.exports = {
  trouverTousClients,
  trouverClientParId,
  trouverClientParEmail,
  trouverClientParTelephone,
  creerClient,
  mettreAJourClient,
  supprimerClient,
  clientADesVisites,
};
