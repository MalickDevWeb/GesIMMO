const agenceService = require('../services/agence.service');
const messagesController = require('../messages/messages.controller');
const messagesService = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');


// méthode pour récupérer toutes les agences
const getAgences = asyncHandler(async (req, res) => {
  const agences = await agenceService.trouverToutesAgences();
  sendResponse(res, HTTP_STATUS.OK, messagesController.agence.listeRecuperee, agences);
});


// méthode pour récupérer une agence par son ID
const getAgenceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agence = await agenceService.trouverAgenceParId(id);
  
  if (!agence) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.agence.nonTrouvee);
  }
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.agence.detailRecupere, agence);
});


// méthode pour créer une nouvelle agence
const createAgence = asyncHandler(async (req, res) => {
  const { code, nom, adresse } = req.body;
  
  
  const existant = await agenceService.trouverAgenceParCode(code);
  if (existant) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.agence.codeExisteDeja(code));
  }
  
  const agence = await agenceService.creerAgence({
    code,
    nom,
    adresse
  });
  
  sendResponse(res, HTTP_STATUS.CREATED, messagesController.agence.creee, agence);
});


// méthode pour mettre à jour une agence existante
const updateAgence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nom, adresse, code } = req.body;
  
  const agenceExistante = await agenceService.trouverAgenceParId(id);
  if (!agenceExistante) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.agence.nonTrouvee);
  }
  
  if (code && code !== agenceExistante.code) {
    const codeExistant = await agenceService.trouverAgenceParCode(code);
    if (codeExistant) {
      throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.agence.codeExisteDeja(code));
    }
  }
  
  const agence = await agenceService.mettreAJourAgence(id, {
    code,
    nom,
    adresse
  });
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.agence.miseAJour, agence);
});


// méthode pour supprimer une agence
const deleteAgence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que l'agence existe
  const agence = await agenceService.trouverAgenceParId(id);
  if (!agence) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.agence.nonTrouvee);
  }
  
  // Vérifier si l'agence a des relations
  const { aDesRelations, clients, biens } = await agenceService.agenceADesRelations(id);
  
  if (aDesRelations) {
    throw new HttpError(
      HTTP_STATUS.CONFLICT,
      messagesService.agence.suppressionImpossibleRelations(clients, biens)
    );
  }
  
  await agenceService.supprimerAgence(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.agence.supprimee);
});

module.exports = {
  getAgences,
  getAgenceById,
  createAgence,
  updateAgence,
  deleteAgence
};
