const messages = {
  agence: {
    nonTrouvee: 'Agence non trouvée',
    codeExisteDeja: (code) => `Une agence avec le code ${code} existe déjà`,
    suppressionImpossibleRelations: (clients, biens) =>
      `Impossible de supprimer : l'agence a ${clients} client(s) et ${biens} bien(s) liés`,
    idInexistant: (id) => `L'agence avec l'ID ${id} n'existe pas`,
  },
  client: {
    nonTrouve: 'Client non trouvé',
    emailExisteDeja: (email) => `Un client avec l'email ${email} existe déjà`,
    telephoneExisteDeja: (telephone) => `Un client avec le téléphone ${telephone} existe déjà`,
    suppressionImpossibleVisites: 'Impossible de supprimer : le client a des visites planifiées',
    idInexistant: (id) => `Le client avec l'ID ${id} n'existe pas`,
  },
  bien: {
    nonTrouve: 'Bien non trouvé',
    idInexistant: (id) => `Le bien avec l'ID ${id} n'existe pas`,
    suppressionImpossibleVisites: 'Impossible de supprimer : le bien a des visites planifiées',
    nonVisitable: (statut) => `Le bien n'est pas disponible pour une visite (statut: ${statut})`,
  },
  visite: {
    nonTrouvee: 'Visite non trouvée',
    doublon: 'Une visite existe déjà pour ce client, ce bien à cette date',
  },
};

module.exports = messages;
