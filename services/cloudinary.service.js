const cloudinary = require('../config/cloudinary');

class CloudinaryService {
  static async uploadImage(file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'blog-posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: {
          width: 1000,
          crop: "limit"
        }
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      throw { name: 'UploadError', message: 'Failed to upload image' };
    }
  }

  static async deleteImage(public_id) {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }
}

module.exports = CloudinaryService;