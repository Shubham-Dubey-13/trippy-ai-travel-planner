const express = require('express');
const { protect } = require('../middleware/auth');
const { searchPlaces } = require('../controllers/placesController');

const router = express.Router();

router.get('/search', protect, searchPlaces);

module.exports = router;
