const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const authentication = require('../middlewares/authentication');

router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.get('/user/:userId', PostController.getUserPosts);

// Protected routes
router.use(authentication);
router.post('/', PostController.create);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);

module.exports = router;