// repositories/base.repo.js
const prisma = require('../config/db');
const { convertirId, traiterIdsWhere } = require('../utils/id.utils');
const messagesRepositories = require('../messages/messages.repositories');

// methode générique pour créer un repository de base pour n'importe quel modèle Prisma
const baseRepo = (modele) => {
  const db = prisma[modele];
  const libelleId = messagesRepositories.ids[modele] || modele;

  return {
    // Trouver tous les enregistrements avec des options de filtrage, tri, pagination, etc.
    async trouverTout(options = {}) {
      if (options.where) {
        options.where = traiterIdsWhere(options.where);
      }
      return db.findMany(options);
    },

   // Trouver un enregistrement par son ID avec des options d'inclusion
    async trouverParId(id, options = {}) {
      const idNumber = convertirId(id, libelleId);
      return db.findUnique({
        where: { id: idNumber },
        ...options
      });
    },

   // Trouver un enregistrement par des critères uniques (ex: email, code) avec des options d'inclusion
    async trouverUn(where, options = {}) {
      const whereTraite = traiterIdsWhere(where);
      return db.findFirst({
        where: whereTraite,
        ...options
      });
    },

    // Créer un nouvel enregistrement
    async creer(donnees) {
      return db.create({ data: donnees });
    },

    // Mettre à jour un enregistrement par son ID
    async mettreAJour(id, donnees) {
      const idNumber = convertirId(id, libelleId);
      return db.update({
        where: { id: idNumber },
        data: donnees
      });
    },

    // Supprimer un enregistrement par son ID
    async supprimer(id) {
      const idNumber = convertirId(id, libelleId);
      return db.delete({ where: { id: idNumber } });
    },

    // Compter le nombre d'enregistrements correspondant à des critères de filtrage
    async compter(where = {}) {
      const whereTraite = traiterIdsWhere(where);
      return db.count({ where: whereTraite });
    }
  };
};

module.exports = baseRepo;
