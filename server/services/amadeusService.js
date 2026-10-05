const Amadeus = require('amadeus');

// Lazy-initialize Amadeus client only when credentials are available
let client = null;

const getClient = () => {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return null;
  }
  if (!client) {
    client = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });
  }
  return client;
};

/**
 * Searches for available flights using the Amadeus API.
 * @param {string} origin       - IATA airport code (e.g., "DEL")
 * @param {string} destination  - IATA airport code (e.g., "BOM")
 * @param {string} date         - ISO date string (YYYY-MM-DD)
 * @param {number} adults       - Number of adult passengers
 * @returns {Array} Formatted flight offers, or [] on failure
 */
const searchFlights = async (origin, destination, date, adults = 1) => {
  const amadeus = getClient();
  if (!amadeus) {
    console.warn('[amadeusService] Amadeus credentials not configured. Returning empty flight results.');
    return [];
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate: date,
      adults: String(adults),
      max: '10',
      currencyCode: 'INR',
    });

    const offers = response.data || [];

    return offers.map((offer) => {
      const itinerary = offer.itineraries?.[0];
      const segment = itinerary?.segments?.[0];
      const price = offer.price;

      return {
        id: offer.id,
        airline: segment?.carrierCode || 'N/A',
        flightNumber: `${segment?.carrierCode || ''}${segment?.number || ''}`,
        departure: {
          airport: segment?.departure?.iataCode,
          time: segment?.departure?.at,
          terminal: segment?.departure?.terminal || null,
        },
        arrival: {
          airport: segment?.arrival?.iataCode,
          time: segment?.arrival?.at,
          terminal: segment?.arrival?.terminal || null,
        },
        duration: itinerary?.duration || 'N/A',
        stops: (itinerary?.segments?.length || 1) - 1,
        price: parseFloat(price?.grandTotal) || 0,
        currency: price?.currency || 'INR',
        seatsAvailable: offer.numberOfBookableSeats || null,
        cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
      };
    });
  } catch (error) {
    console.warn('[amadeusService] Flight search failed:', error.description || error.message);
    return [];
  }
};

/**
 * Searches for hotels in a city using the Amadeus API.
 * @param {string} cityCode  - IATA city code (e.g., "PAR")
 * @param {string} checkIn   - ISO date (YYYY-MM-DD)
 * @param {string} checkOut  - ISO date (YYYY-MM-DD)
 * @param {number} adults    - Number of guests
 * @param {number} maxPrice  - Optional maximum price filter
 * @returns {Array} Formatted hotel results, or [] on failure
 */
const searchHotels = async (cityCode, checkIn, checkOut, adults = 1, maxPrice = null) => {
  const amadeus = getClient();
  if (!amadeus) {
    console.warn('[amadeusService] Amadeus credentials not configured. Returning empty hotel results.');
    return [];
  }

  try {
    // Step 1: Get hotel IDs for the city
    const listResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode.toUpperCase(),
    });

    const hotelIds = (listResponse.data || [])
      .slice(0, 20)
      .map((h) => h.hotelId)
      .filter(Boolean);

    if (hotelIds.length === 0) return [];

    // Step 2: Get hotel offers for those IDs
    const offerParams = {
      hotelIds: hotelIds.join(','),
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: String(adults),
      currency: 'INR',
      bestRateOnly: true,
    };
    if (maxPrice) offerParams.priceRange = `0-${maxPrice}`;

    const offersResponse = await amadeus.shopping.hotelOffersSearch.get(offerParams);

    const hotels = offersResponse.data || [];

    return hotels.map((item) => {
      const hotel = item.hotel || {};
      const offer = item.offers?.[0] || {};
      const price = offer.price || {};

      return {
        hotelId: hotel.hotelId,
        name: hotel.name || 'Unknown Hotel',
        rating: hotel.rating || null,
        address: hotel.address
          ? `${hotel.address.lines?.join(', ') || ''}, ${hotel.address.cityName || ''}`
          : 'N/A',
        latitude: hotel.latitude || null,
        longitude: hotel.longitude || null,
        amenities: hotel.amenities || [],
        price: parseFloat(price.total) || 0,
        currency: price.currency || 'INR',
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        roomType: offer.room?.typeEstimated?.category || 'Standard',
        boardType: offer.boardType || 'ROOM_ONLY',
      };
    });
  } catch (error) {
    console.warn('[amadeusService] Hotel search failed:', error.description || error.message);
    return [];
  }
};

module.exports = { searchFlights, searchHotels };
