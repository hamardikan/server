const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const authentication = require('../middlewares/authentication');

// Get comments doesn't need authentication
router.get('/post/:postId', CommentController.getPostComments);

// All other routes need authentication
router.use(authentication);
router.post('/post/:postId', CommentController.create);
router.put('/:id', CommentController.update);
router.delete('/:id', CommentController.delete);
router.post('/:id/like', CommentController.toggleLike);

module.exports = router;