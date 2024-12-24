const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ message: 'OK' });
});

// Will add these route files as we create them
// router.use('/auth', require('./auth'));
// router.use('/posts', require('./posts'));
// router.use('/tags', require('./tags'));

module.exports = router;