
const cloudinary = require('../config/cloudinary');
const messagesUtils = require('../messages/messages.utils');
const HTTP_STATUS = require('../messages/httpStatus');
const { HttpError } = require('./httpError');

// méthode pour uploader une image sur Cloudinary
const uploadImage = async (fichier, dossier = 'tech221-immo/biens') => {
  if (!fichier) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, messagesUtils.uploadImage.aucunFichier);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: dossier, resource_type: 'image' },
      (erreur, resultat) => {
        if (erreur) {
          return reject(new HttpError(HTTP_STATUS.INTERNAL_SERVER_ERROR, messagesUtils.uploadImage.erreurUpload));
        }
        resolve(resultat);
      }
    );
    stream.end(fichier.buffer);
  });
};

// méthode pour supprimer une image de Cloudinary
const supprimerImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, supprimerImage };
