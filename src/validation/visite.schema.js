const Joi = require('joi');
const messagesValidation = require('../messages/messages.validation');

const STATUTS_VISITE = ['DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'EFFECTUEE'];

const schemaCreerVisite = Joi.object({
  clientId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': messagesValidation.visite.clientIdObligatoire,
    'number.base': messagesValidation.visite.clientIdNombre,
    'number.integer': messagesValidation.visite.clientIdEntier,
  }),
  bienId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': messagesValidation.visite.bienIdObligatoire,
    'number.base': messagesValidation.visite.bienIdNombre,
    'number.integer': messagesValidation.visite.bienIdEntier,
  }),
  dateVisite: Joi.date().iso().greater('now').required().messages({
    'date.greater': messagesValidation.visite.dateFutur,
    'any.required': messagesValidation.visite.dateObligatoire,
    'date.format': messagesValidation.visite.dateIso,
  }),
  commentaire: Joi.string().max(500).optional().allow(''),
});

const schemaMettreAJourVisite = Joi.object({
  statut: Joi.string().valid(...STATUTS_VISITE).required().messages({
    'any.only': messagesValidation.visite.statutInvalide(STATUTS_VISITE),
    'any.required': messagesValidation.visite.statutObligatoireMaj,
  }),
  commentaire: Joi.string().max(500).optional().allow(''),
});

module.exports = { schemaCreerVisite, schemaMettreAJourVisite };
