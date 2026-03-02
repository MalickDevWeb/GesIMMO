
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const messagesConfig = require('./messages/messages.config');

// Configuration
const env = require('./config/env');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Routes
const agenceRoutes = require('./routes/agence.routes');
const clientRoutes = require('./routes/client.routes');
const bienRoutes = require('./routes/bien.routes');
const visiteRoutes = require('./routes/visite.routes');

// Initialisation de l'application Express
const app = express();

//  Middlewares globaux 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

//  Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: messagesConfig.swagger.titreSite,
}));

//  Route de santé
app.get('/health', (req, res) => {
  res.json({
    succes: true,
    message: messagesConfig.app.healthMessage,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// Routes de l'API
app.use('/api/agences', agenceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/biens',   bienRoutes);
app.use('/api/visites', visiteRoutes);

// Gestion des erreurs (DOIT être en dernier)
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(env.PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║       ${messagesConfig.app.startup.title}       ║`);
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  ✅ ${messagesConfig.app.startup.serveurDemarre(env.PORT)}            ║`);
  console.log(`║  🌐 ${messagesConfig.app.startup.url(env.PORT)}                ║`);
  console.log(`║  📚 ${messagesConfig.app.startup.docs(env.PORT)}       ║`);
  console.log('╚══════════════════════════════════════════════════╝\n');
});

module.exports = app;
