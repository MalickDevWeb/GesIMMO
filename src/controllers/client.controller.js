const clientService = require('../services/client.service');
const agenceService = require('../services/agence.service');
const messagesController = require('../messages/messages.controller');
const messagesService = require('../messages/messages.service');
const HTTP_STATUS = require('../messages/httpStatus');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const { HttpError } = require('../utils/httpError');


// méthode pour récupérer tous les clients avec des filtres optionnels
const getClients = asyncHandler(async (req, res) => {
  const { agenceId, recherche } = req.query;
  
  const filtres = {};
  if (agenceId) filtres.agenceId = agenceId;
  if (recherche) filtres.recherche = recherche;
  
  const clients = await clientService.trouverTousClients(filtres);
  sendResponse(res, HTTP_STATUS.OK, messagesController.client.listeRecuperee, clients);
});

// méthode pour récupérer un client par son ID
const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await clientService.trouverClientParId(id);
  
  if (!client) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.client.nonTrouve);
  }
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.client.detailRecupere, client);
});

// méthode pour créer un nouveau client
const createClient = asyncHandler(async (req, res) => {
  const { prenom, nom, email, telephone, agenceId } = req.body;
  
  // Vérifier si l'email existe déjà
  const emailExistant = await clientService.trouverClientParEmail(email);
  if (emailExistant) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.client.emailExisteDeja(email));
  }

  // Vérifier si le téléphone existe déjà
  if (telephone) {
    const telephoneExistant = await clientService.trouverClientParTelephone(telephone);
    if (telephoneExistant) {
      throw new HttpError(
        HTTP_STATUS.CONFLICT,
        messagesService.client.telephoneExisteDeja(telephone)
      );
    }
  }
  
  // Vérifier que l'agence existe
  const agence = await agenceService.trouverAgenceParId(agenceId);
  if (!agence) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messagesService.agence.idInexistant(agenceId));
  }
  
  const client = await clientService.creerClient({
    prenom,
    nom,
    email,
    telephone,
    agenceId: parseInt(agenceId)
  });
  
  sendResponse(res, HTTP_STATUS.CREATED, messagesController.client.cree, client);
});

// méthode pour mettre à jour un client existant
const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, email, telephone, agenceId } = req.body;
  
  // Vérifier que le client existe
  const clientExist = await clientService.trouverClientParId(id);
  if (!clientExist) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.client.nonTrouve);
  }
  
  // Si l'email est modifié, vérifier son unicité
  if (email && email !== clientExist.email) {
    const emailExistant = await clientService.trouverClientParEmail(email);
    if (emailExistant) {
      throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.client.emailExisteDeja(email));
    }
  }
  
  // Si l'agenceId est modifié, vérifier que l'agence existe
  if (agenceId) {
    const agence = await agenceService.trouverAgenceParId(agenceId);
    if (!agence) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, messagesService.agence.idInexistant(agenceId));
    }
  }
  
  const client = await clientService.mettreAJourClient(id, {
    prenom,
    nom,
    email,
    telephone,
    agenceId: agenceId ? parseInt(agenceId) : undefined
  });
  
  sendResponse(res, HTTP_STATUS.OK, messagesController.client.misAJour, client);
});

// méthode pour supprimer un client
const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que le client existe
  const client = await clientService.trouverClientParId(id);
  if (!client) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, messagesService.client.nonTrouve);
  }
  
  // Vérifier si le client a des visites
  const aDesVisites = await clientService.clientADesVisites(id);
  if (aDesVisites) {
    throw new HttpError(HTTP_STATUS.CONFLICT, messagesService.client.suppressionImpossibleVisites);
  }
  
  await clientService.supprimerClient(id);
  sendResponse(res, HTTP_STATUS.OK, messagesController.client.supprime);
});

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
