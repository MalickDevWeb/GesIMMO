const Joi = require('joi');
const messagesValidation = require('../messages/messages.validation');

const TYPES_BIEN = ['MAISON', 'APPARTEMENT', 'STUDIO', 'TERRAIN', 'VILLA', 'BUREAU', 'COMMERCE'];
const STATUTS_BIEN = ['DISPONIBLE', 'RESERVE', 'LOUE', 'VENDU', 'ARCHIVE'];

const schemaCreerBien = Joi.object({
  titre: Joi.string().min(3).max(200).required().messages({
    'any.required': messagesValidation.bien.titreObligatoire,
    'string.empty': messagesValidation.bien.titreVide,
  }),
  type: Joi.string().valid(...TYPES_BIEN).required().messages({
    'any.only': messagesValidation.bien.typeInvalide(TYPES_BIEN),
    'any.required': messagesValidation.bien.typeObligatoire,
  }),
  adresse: Joi.string().min(5).max(255).required().messages({
    'any.required': messagesValidation.bien.adresseObligatoire,
    'string.empty': messagesValidation.bien.adresseVide,
  }),
  prix: Joi.number().min(0).required().messages({
    'number.min': messagesValidation.bien.prixMin,
    'any.required': messagesValidation.bien.prixObligatoire,
  }),
  statut: Joi.string().valid(...STATUTS_BIEN).default('DISPONIBLE'),
  agenceId: Joi.number().integer().required().messages({  // CORRECTION : number().integer() au lieu de integer()
    'any.required': messagesValidation.bien.agenceIdObligatoire,
    'number.base': messagesValidation.bien.agenceIdNombre,
    'number.integer': messagesValidation.bien.agenceIdEntier,
  }),
});

const schemaMettreAJourBien = Joi.object({
  titre: Joi.string().min(3).max(200),
  type: Joi.string().valid(...TYPES_BIEN),
  adresse: Joi.string().min(5).max(255),
  prix: Joi.number().min(0),
  statut: Joi.string().valid(...STATUTS_BIEN),
  agenceId: Joi.number().integer(),  // CORRECTION : number().integer() au lieu de integer()
}).min(1);

module.exports = { schemaCreerBien, schemaMettreAJourBien };
