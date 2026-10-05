const { validationResult } = require('express-validator');
const amadeusService = require('../services/amadeusService');

/**
 * @route  GET /api/flights/search
 * @desc   Search for available flights
 * @access Private
 * @query  origin, destination, date (YYYY-MM-DD), adults
 */
const searchFlights = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { origin, destination, date, adults = 1 } = req.query;

    const results = await amadeusService.searchFlights(origin, destination, date, parseInt(adults));

    if (results.length === 0) {
      return res.json({
        success: true,
        message: 'No flights found or flight search is currently unavailable.',
        flights: [],
      });
    }

    res.json({
      success: true,
      count: results.length,
      flights: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchFlights };
