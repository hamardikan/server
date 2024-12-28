const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

router.get('/health', (req, res) => {
  res.json({ message: 'OK' });
});

router.use('/auth', require('./auth'));
router.use('/posts', require('./posts'));
router.use('/tags', require('./tags'));
router.use('/comments', require('./comments'));
router.use('/ai', require('./ai'));
router.use('/images', require('./images'))
router.use('/users', require('./users'));

module.exports = router;