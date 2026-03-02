const messagesMiddlewares = {
  errorHandler: {
    logPrefix: '[ERREUR]',
    prisma: {
      violationContrainteUnique: (champ) => `Violation de contrainte unique sur : ${champ}`,
      enregistrementIntrouvable: 'Enregistrement introuvable',
      referenceInvalide: "Référence invalide : la ressource liée n'existe pas",
      erreurInterneServeur: 'Erreur interne du serveur',
    },
    validation: {
      indiceIdInvalide: 'doit être un nombre',
    },
  },
  validate: {
    donneesInvalides: 'Données invalides',
  },
  notFound: {
    routeIntrouvable: (method, url) => `Route introuvable : ${method} ${url}`,
  },
  upload: {
    formatFichierNonSupporte: 'Format de fichier non supporté. Utilisez : JPEG, PNG ou WebP',
  },
};

module.exports = messagesMiddlewares;
