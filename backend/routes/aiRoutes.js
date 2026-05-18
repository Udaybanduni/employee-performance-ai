const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/recommend', getRecommendations);

module.exports = router;
