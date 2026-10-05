const { validationResult } = require('express-validator');
const amadeusService = require('../services/amadeusService');

/**
 * @route  GET /api/hotels/search
 * @desc   Search for available hotels
 * @access Private
 * @query  destination (IATA city code), checkIn (YYYY-MM-DD), checkOut (YYYY-MM-DD), adults, maxPrice
 */
const searchHotels = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { destination, checkIn, checkOut, adults = 1, maxPrice } = req.query;

    const results = await amadeusService.searchHotels(
      destination,
      checkIn,
      checkOut,
      parseInt(adults),
      maxPrice ? parseFloat(maxPrice) : null
    );

    if (results.length === 0) {
      return res.json({
        success: true,
        message: 'No hotels found or hotel search is currently unavailable.',
        hotels: [],
      });
    }

    res.json({
      success: true,
      count: results.length,
      hotels: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchHotels };
