
const visiteRepo = require('../repositories/visite.repo');
const clientRepo = require('../repositories/client.repo');
const bienRepo = require('../repositories/bien.repo');
const messages = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const { HttpError } = require('../utils/httpError');

async function trouverToutesVisites(filtres = {}) {
  return visiteRepo.trouverToutesVisites(filtres);
}

async function trouverVisiteParId(id) {
  const visite = await visiteRepo.trouverVisiteParId(id);
  if (!visite) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messages.visite.nonTrouvee);
  }
  return visite;
}

async function planifierVisite(donnees) {
  const { clientId, bienId, dateVisite, commentaire } = donnees;

  const client = await clientRepo.trouverClientParId(clientId);
  if (!client) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.client.idInexistant(clientId));
  }

  const bien = await bienRepo.trouverBienParId(bienId);
  if (!bien) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messages.bien.idInexistant(bienId));
  }

  const estVisitable = await bienRepo.bienEstVisitable(bienId);
  if (!estVisitable) {
    throw new HttpError(HTTP_STATUS.UNPROCESSABLE_ENTITY, messages.bien.nonVisitable(bien.statut));
  }

  const doublon = await visiteRepo.verifierDoublonVisite(clientId, bienId, dateVisite);
  if (doublon) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messages.visite.doublon);
  }

  return visiteRepo.creer({
    clientId,
    bienId,
    dateVisite: new Date(dateVisite),
    statut: 'DEMANDEE',
    commentaire: commentaire || null,
  });
}

async function mettreAJourVisite(id, donnees) {
  await trouverVisiteParId(id);
  return visiteRepo.mettreAJour(id, donnees);
}

async function updateStatutVisite(id, statut) {
  await trouverVisiteParId(id);
  return visiteRepo.mettreAJour(id, { statut });
}

async function annulerVisite(id) {
  return updateStatutVisite(id, 'ANNULEE');
}

async function confirmerVisite(id) {
  return updateStatutVisite(id, 'CONFIRMEE');
}

async function effectuerVisite(id) {
  return updateStatutVisite(id, 'EFFECTUEE');
}

async function supprimerVisite(id) {
  await trouverVisiteParId(id);
  return visiteRepo.supprimer(id);
}

async function verifierDoublonVisite(clientId, bienId, dateVisite) {
  return visiteRepo.verifierDoublonVisite(clientId, bienId, dateVisite);
}

module.exports = {
  trouverToutesVisites,
  trouverVisiteParId,
  planifierVisite,
  mettreAJourVisite,
  updateStatutVisite,
  annulerVisite,
  confirmerVisite,
  effectuerVisite,
  supprimerVisite,
  verifierDoublonVisite,
};
