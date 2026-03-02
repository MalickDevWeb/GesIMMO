const asyncHandler = require('./asyncHandler');
const messagesUtils = require('../messages/messages.utils');
const { repondreSucces, repondreCreation } = require('./response');

// Génère un contrôleur CRUD générique pour un service donné
const creerControleurCrud = (service, nom) => ({
  creerTout: asyncHandler(async (req, res) => {
    const items = await service.recupererTout(req.query);
    repondreSucces(res, items, messagesUtils.crudController.listeRecuperee(nom));
  }),

  creerUn: asyncHandler(async (req, res) => {
    const item = await service.recupererParId(req.params.id);
    repondreSucces(res, item, messagesUtils.crudController.detailRecupere(nom));
  }),

  creerNouveau: asyncHandler(async (req, res) => {
    const item = await service.creer(req.body);
    repondreCreation(res, item, messagesUtils.crudController.cree(nom));
  }),

  mettreAJour: asyncHandler(async (req, res) => {
    const item = await service.mettreAJour(req.params.id, req.body);
    repondreSucces(res, item, messagesUtils.crudController.misAJour(nom));
  }),

  supprimer: asyncHandler(async (req, res) => {
    await service.supprimer(req.params.id);
    repondreSucces(res, null, messagesUtils.crudController.supprime(nom));
  }),
});

module.exports = creerControleurCrud;
