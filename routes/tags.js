const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');
const authentication = require('../middlewares/authentication');

// Public routes
router.get('/', TagController.getAll);
router.get('/trending', TagController.getTrending);
router.get('/:id', TagController.getOne);
router.get('/:id/posts', TagController.getTagPosts);

// Protected routes
router.use(authentication);
router.post('/', TagController.create);
router.put('/:id', TagController.update);
router.delete('/:id', TagController.delete);

module.exports = router;