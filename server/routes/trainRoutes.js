const express = require('express');
const { protect } = require('../middleware/auth');
const trainService = require('../services/trainService');

const router = express.Router();

/**
 * @route  GET /api/trains/search
 * @desc   Search for available trains between two cities
 * @access Private
 * @query  origin, destination, date
 */
router.get('/search', protect, async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'origin, destination, and date query parameters are required.',
      });
    }

    const result = await trainService.searchTrains(origin, destination, date);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
