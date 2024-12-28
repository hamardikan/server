const CloudinaryService = require('../services/cloudinary.service');
const fs = require('fs').promises;

class ImageController {
  static async upload(req, res, next) {
    try {
      if (!req.file) {
        throw { name: 'BadRequest', message: 'No image file provided' };
      }

      const result = await CloudinaryService.uploadImage(req.file);
      
      // Delete temporary file
      await fs.unlink(req.file.path);

      res.json({
        url: result.url,
        public_id: result.public_id
      });
    } catch (err) {
      // Clean up temporary file if exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      next(err);
    }
  }
}

module.exports = ImageController;