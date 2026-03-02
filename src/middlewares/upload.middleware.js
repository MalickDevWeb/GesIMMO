
const multer = require('multer');
const { creerErreur } = require('../utils/httpError');
const messagesMiddlewares = require('../messages/messages.middlewares');
const HTTP_STATUS = require('../messages/httpStatus');

// Stockage en mémoire (buffer) → envoyé ensuite à Cloudinary
const stockage = multer.memoryStorage();

// Filtre : accepter uniquement les images
const filtrerFichier = (req, fichier, cb) => {
  const typesAcceptes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (typesAcceptes.includes(fichier.mimetype)) {
    cb(null, true);
  } else {
    cb(creerErreur(HTTP_STATUS.BAD_REQUEST, messagesMiddlewares.upload.formatFichierNonSupporte), false);
  }
};

// Configuration Multer
const upload = multer({
  storage: stockage,
  fileFilter: filtrerFichier,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo maximum
  },
});

// Middlewares préconfigurés
const uploadUneFoto = upload.single('image');
const uploadPlusieursPhotos = upload.array('images', 5); // Max 5 images

module.exports = { uploadUneFoto, uploadPlusieursPhotos };
