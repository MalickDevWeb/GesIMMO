const messagesUtils = {
  id: {
    requis: (nom) => `Le ${nom} est requis`,
    nombreInvalide: (nom, id) => `Le ${nom} doit être un nombre valide (reçu: ${id})`,
  },
  uploadImage: {
    aucunFichier: 'Aucun fichier fourni',
    erreurUpload: "Erreur lors de l'upload de l'image",
  },
  serviceHelpers: {
    ressourceIntrouvable: (nom, id) => `${nom} avec l'id "${id}" introuvable`,
    enregistrementExisteDeja: (champ, valeur) =>
      `Un enregistrement avec ${champ} "${valeur}" existe déjà`,
  },
  crudController: {
    listeRecuperee: (nom) => `Liste des ${nom} récupérée`,
    detailRecupere: (nom) => `${nom} récupéré`,
    cree: (nom) => `${nom} créé avec succès`,
    misAJour: (nom) => `${nom} mis à jour`,
    supprime: (nom) => `${nom} supprimé`,
  },
};

module.exports = messagesUtils;
