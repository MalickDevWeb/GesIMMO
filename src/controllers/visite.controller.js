const visiteService = require('../services/visite.service');
const clientService = require('../services/client.service');
const bienService = require('../services/bien.service');
const messagesController = require('../messages/messages.controller');
const messagesService = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');


// méthode pour récupérer toutes les visites avec des filtres optionnels
const getVisites = asyncHandler(async (req, res) => {
  const { clientId, bienId, statut } = req.query;
  
  const filtres = {};
  if (clientId) filtres.clientId = clientId;
  if (bienId) filtres.bienId = bienId;
  if (statut) filtres.statut = statut;
  
  const visites = await visiteService.trouverToutesVisites(filtres);
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.listeRecuperee, visites);
});

// méthode pour récupérer une visite par son ID
const getVisiteById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const visite = await visiteService.trouverVisiteParId(id);
  
  if (!visite) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.visite.nonTrouvee);
  }
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.detailRecupere, visite);
});

// méthode pour créer une nouvelle visite
const createVisite = asyncHandler(async (req, res) => {
  const { clientId, bienId, dateVisite, commentaire } = req.body;
  
  // Vérifier que le client existe
  const client = await clientService.trouverClientParId(clientId);
  if (!client) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messagesService.client.idInexistant(clientId));
  }
  
  // Vérifier que le bien existe
  const bien = await bienService.trouverBienParId(bienId);
  if (!bien) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messagesService.bien.idInexistant(bienId));
  }
  
  // Vérifier que le bien est visitable (pas LOUE, VENDU ou ARCHIVE)
  const estVisitable = await bienService.bienEstVisitable(bienId);
  if (!estVisitable) {
    throw new HttpError(HTTP_STATUS.UNPROCESSABLE_ENTITY, messagesService.bien.nonVisitable(bien.statut));
  }
  
  // Vérifier les doublons
  const doublon = await visiteService.verifierDoublonVisite(clientId, bienId, dateVisite);
  if (doublon) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.visite.doublon);
  }
  
  const visite = await visiteService.planifierVisite({
    clientId: parseInt(clientId),
    bienId: parseInt(bienId),
    dateVisite: new Date(dateVisite),
    commentaire,
    statut: 'DEMANDEE'
  });
  
  sendResponse(res, HTTP_STATUS.CREATED, messagesController.visite.planifiee, visite);
});

// méthode pour mettre à jour le statut d'une visite
const updateStatutVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { statut, commentaire } = req.body;
  
  // Vérifier que la visite existe
  const visiteExist = await visiteService.trouverVisiteParId(id);
  if (!visiteExist) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.visite.nonTrouvee);
  }
  
  const visite = await visiteService.mettreAJourVisite(id, { 
    statut, 
    commentaire: commentaire || visiteExist.commentaire 
  });
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.statutMisAJour, visite);
});

// méthode pour annuler une visite
const annulerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.annulerVisite(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.annulee, visite);
});

// méthode pour confirmer une visite
const confirmerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.confirmerVisite(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.confirmee, visite);
});

// méthode pour marquer une visite comme effectuée
const effectuerVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const visite = await visiteService.effectuerVisite(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.effectuee, visite);
});


// méthode pour supprimer une visite
const deleteVisite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que la visite existe
  const visite = await visiteService.trouverVisiteParId(id);
  if (!visite) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.visite.nonTrouvee);
  }
  
  await visiteService.supprimerVisite(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.visite.supprimee);
});

module.exports = {
  getVisites,
  getVisiteById,
  createVisite,
  updateStatutVisite,
  annulerVisite,
  confirmerVisite,
  effectuerVisite,
  deleteVisite
};
