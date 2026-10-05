/**
 * Train search service — placeholder for a future train booking API integration.
 * Replace the body of searchTrains with real API calls (e.g., RailwayAPI, IRCTC, Trainline)
 * once credentials are available.
 */

/**
 * Searches for available trains between two cities.
 * @param {string} origin       - Departure city or station code
 * @param {string} destination  - Arrival city or station code
 * @param {string} date         - Travel date (YYYY-MM-DD)
 * @returns {Object} Results object or unavailability notice
 */
const searchTrains = async (origin, destination, date) => {
  const apiKey = process.env.TRAIN_API_KEY;

  if (!apiKey) {
    return {
      available: false,
      message: 'Train search is not configured. Please add TRAIN_API_KEY to your environment variables.',
      origin,
      destination,
      date,
    };
  }

  // ── Future Integration Point ───────────────────────────────────────────────
  // Example: Indian Railways API or RapidAPI train endpoints
  // const response = await axios.get('https://trains.api.example.com/search', {
  //   params: { from: origin, to: destination, date },
  //   headers: { 'X-Api-Key': apiKey },
  // });
  // return formatTrainResults(response.data);

  return {
    available: false,
    message: 'Train search not configured',
  };
};

module.exports = { searchTrains };
