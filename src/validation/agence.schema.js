const Joi = require('joi');
const messagesValidation = require('../messages/messages.validation');

const schemaCreerAgence = Joi.object({
  code: Joi.string()
    .pattern(/^[A-Z]{2,3}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': messagesValidation.agence.codeFormat,
      'any.required': messagesValidation.agence.codeObligatoire,
      'string.empty': messagesValidation.agence.codeVide,
    }),
  nom: Joi.string().min(2).max(100).required().messages({
    'any.required': messagesValidation.agence.nomObligatoire,
    'string.empty': messagesValidation.agence.nomVide,
    'string.min': messagesValidation.agence.nomMin,
  }),
  adresse: Joi.string().min(5).max(255).required().messages({
    'any.required': messagesValidation.agence.adresseObligatoire,
    'string.empty': messagesValidation.agence.adresseVide,
  }),
});

const schemaMettreAJourAgence = Joi.object({
  nom: Joi.string().min(2).max(100),
  adresse: Joi.string().min(5).max(255),
}).min(1).messages({
  'object.min': messagesValidation.commun.auMoinsUnChamp,
});

module.exports = { schemaCreerAgence, schemaMettreAJourAgence };
