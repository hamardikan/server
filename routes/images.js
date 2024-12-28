const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const authentication = require('../middlewares/authentication');

router.use(authentication);
router.post('/upload', upload.single('image'), ImageController.upload);

module.exports = router;