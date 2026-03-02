const messagesConfig = {
  swagger: {
    titreSite: 'TECH 221 Immo - API',
  },
  app: {
    healthMessage: 'TECH 221 Immo API — Opérationnelle',
    startup: {
      title: 'TECH 221 — API Immobilière v1.0.0',
      serveurDemarre: (port) => `Serveur démarré sur le port : ${port}`,
      url: (port) => `URL : http://localhost:${port}`,
      docs: (port) => `Docs : http://localhost:${port}/api-docs`,
    },
  },
};

module.exports = messagesConfig;
