const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');

// Public routes - no authentication needed
router.post('/chat/post/:postId', AIController.chatAboutPost);
router.get('/analyze/post/:postId', AIController.analyzeBlogPost);
router.get('/suggest/post/:postId', AIController.suggestRelatedTopics);

module.exports = router;