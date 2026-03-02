const baseRepo = require('./base.repo');
const prisma = require('../config/db');
const { convertirId } = require('../utils/id.utils');
const messagesRepositories = require('../messages/messages.repositories');

// Créer le repository de base pour 'visite'
const visiteBase = baseRepo('visite');

// méthode pour récupérer toutes les visites avec des filtres optionnels
async function trouverToutesVisites(filtres = {}) {
  const where = {};
  
  if (filtres.clientId) {
    where.clientId = convertirId(filtres.clientId, messagesRepositories.ids.client);
  }
  
  if (filtres.bienId) {
    where.bienId = convertirId(filtres.bienId, messagesRepositories.ids.bien);
  }
  
  if (filtres.statut) where.statut = filtres.statut;

  return prisma.visite.findMany({
    where,
    include: {
      client: { select: { id: true, prenom: true, nom: true, email: true } },
      bien: { select: { id: true, titre: true, adresse: true, type: true } },
    },
    orderBy: { dateVisite: 'asc' },
  });
}

// méthode pour récupérer une visite par son ID avec les détails complets
async function trouverVisiteParId(id) {
  return visiteBase.trouverParId(id, {
    include: {
      client: true,
      bien: { 
        include: { 
          agence: { select: { code: true, nom: true } } 
        } 
      },
    },
  });
}

// méthode pour vérifier les doublons de visite (même client, même bien, même date)
async function verifierDoublonVisite(clientId, bienId, dateVisite) {
  const clientIdNum = convertirId(clientId, messagesRepositories.ids.client);
  const bienIdNum = convertirId(bienId, messagesRepositories.ids.bien);
  
  return prisma.visite.findUnique({
    where: {
      clientId_bienId_dateVisite: {
        clientId: clientIdNum,
        bienId: bienIdNum,
        dateVisite: new Date(dateVisite)
      }
    }
  });
}

// méthode pour compter le nombre de visites associées à un client
async function compterVisitesParClient(clientId) {
  const id = convertirId(clientId, messagesRepositories.ids.client);
  
  return prisma.visite.count({
    where: { clientId: id }
  });
}

// méthode pour compter le nombre de visites associées à un bien
async function compterVisitesParBien(bienId) {
  const id = convertirId(bienId, messagesRepositories.ids.bien);
  
  return prisma.visite.count({
    where: { bienId: id }
  });
}

// méthode pour récupérer les visites à venir (dateVisite >= aujourd'hui et statut DEMANDEE ou CONFIRMEE)
async function trouverVisitesAVenir() {
  const maintenant = new Date();
  
  return prisma.visite.findMany({
    where: {
      dateVisite: { gte: maintenant },
      statut: { in: ['DEMANDEE', 'CONFIRMEE'] }
    },
    include: {
      client: { select: { prenom: true, nom: true, email: true } },
      bien: { select: { titre: true, adresse: true } }
    },
    orderBy: { dateVisite: 'asc' }
  });
}

// méthode pour mettre à jour le statut d'une visite
async function mettreAJourStatut(id, statut) {
  const idNumber = convertirId(id, messagesRepositories.ids.visite);
  
  return prisma.visite.update({
    where: { id: idNumber },
    data: { statut }
  });
}

module.exports = {
  ...visiteBase,
  trouverToutesVisites,
  trouverVisiteParId,
  verifierDoublonVisite,
  compterVisitesParClient,
  compterVisitesParBien,
  trouverVisitesAVenir,
  mettreAJourStatut
};
