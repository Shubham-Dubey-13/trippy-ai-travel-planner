const placesService = require('../services/placesService');

/**
 * @route  GET /api/places/search
 * @desc   Search for tourist attractions at a destination
 * @access Private
 * @query  destination (string), limit (number, optional)
 */
const searchPlaces = async (req, res, next) => {
  try {
    const { destination, limit } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'destination query parameter is required.',
      });
    }

    const attractions = await placesService.searchAttractions(
      destination,
      limit ? parseInt(limit) : 10
    );

    res.json({
      success: true,
      destination,
      count: attractions.length,
      attractions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchPlaces };
