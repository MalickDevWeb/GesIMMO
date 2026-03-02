const Joi = require('joi');
const messagesValidation = require('../messages/messages.validation');

const schemaCreerClient = Joi.object({
  prenom: Joi.string().min(2).max(50).required().messages({
    'any.required': messagesValidation.client.prenomObligatoire,
    'string.empty': messagesValidation.client.prenomVide,
  }),
  nom: Joi.string().min(2).max(50).required().messages({
    'any.required': messagesValidation.client.nomObligatoire,
    'string.empty': messagesValidation.client.nomVide,
  }),
  email: Joi.string().email().required().messages({
    'string.email': messagesValidation.client.emailInvalide,
    'any.required': messagesValidation.client.emailObligatoire,
  }),
 telephone: Joi.string()
    .regex(
      /^\+221(77|78|76)[0-9]{7}$/,
      messagesValidation.client.telephoneFormat
    ),
  agenceId: Joi.number().integer().required().messages({
    'any.required': messagesValidation.client.agenceIdObligatoire,
    'number.base': messagesValidation.client.agenceIdNombre,
    'number.integer': messagesValidation.client.agenceIdEntier,
  }),
});

const schemaMettreAJourClient = Joi.object({
  prenom: Joi.string().min(2).max(50),
  nom: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  telephone: Joi.string().pattern(/^(\+?[0-9]{7,15})$/),
  agenceId: Joi.number().integer().messages({
    'number.base': messagesValidation.client.agenceIdNombre,
    'number.integer': messagesValidation.client.agenceIdEntier,
  }),
}).min(1);

module.exports = { schemaCreerClient, schemaMettreAJourClient };
