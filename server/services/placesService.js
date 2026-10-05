const axios = require('axios');

const BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

/**
 * Searches for tourist attractions near a destination using the OpenTripMap API.
 * @param {string} destination - City or place name to search
 * @param {number} limit       - Maximum number of attractions to return
 * @returns {Array} Formatted attraction objects, or [] on failure
 */
const searchAttractions = async (destination, limit = 10) => {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    console.warn('[placesService] OPENTRIPMAP_API_KEY not set. Returning empty attractions.');
    return [];
  }

  try {
    // Step 1: Resolve destination name to coordinates via geoname endpoint
    const geoResponse = await axios.get(`${BASE_URL}/geoname`, {
      params: { name: destination, apikey: apiKey },
      timeout: 8000,
    });

    const { lon, lat } = geoResponse.data;

    if (!lon || !lat) {
      console.warn(`[placesService] Could not resolve coordinates for "${destination}".`);
      return [];
    }

    // Step 2: Fetch attractions within a 5 km radius
    const placesResponse = await axios.get(`${BASE_URL}/radius`, {
      params: {
        radius: 5000,
        lon,
        lat,
        limit,
        format: 'json',
        rate: 3,           // Minimum rating (0-3 scale)
        apikey: apiKey,
      },
      timeout: 8000,
    });

    const places = placesResponse.data || [];

    return places
      .filter((p) => p.name) // Remove unnamed places
      .map((place) => ({
        xid: place.xid,
        name: place.name,
        kinds: place.kinds || '',
        dist: place.dist ? `${(place.dist / 1000).toFixed(1)} km` : 'N/A',
        rate: place.rate || 0,
        lat: place.point?.lat || null,
        lon: place.point?.lon || null,
      }));
  } catch (error) {
    console.warn('[placesService] Attraction search failed:', error.message);
    return [];
  }
};

module.exports = { searchAttractions };
