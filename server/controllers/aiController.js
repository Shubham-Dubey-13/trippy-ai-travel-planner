const Trip = require('../models/Trip');
const ChatHistory = require('../models/ChatHistory');
const geminiService = require('../services/geminiService');
const placesService = require('../services/placesService');

/**
 * Validates that an itinerary object has required top-level fields.
 */
const validateItinerary = (itinerary) => {
  if (!itinerary || typeof itinerary !== 'object') return false;
  if (!itinerary.destination) return false;
  if (!Array.isArray(itinerary.days) || itinerary.days.length === 0) return false;
  if (typeof itinerary.estimatedBudget !== 'number') return false;
  return true;
};

/**
 * @route  POST /api/ai/generate-itinerary
 * @desc   Generate a full AI itinerary for a trip
 * @access Private
 */
const generateItinerary = async (req, res, next) => {
  try {
    const {
      source,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      interests,
      travelStyle,
      accommodationPreference,
      saveTripId, // Optional: attach itinerary to an existing trip
    } = req.body;

    if (!source || !destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: 'source, destination, startDate, endDate, and budget are required.',
      });
    }

    const tripData = {
      source,
      destination,
      startDate,
      endDate,
      travelers: travelers || 1,
      budget,
      interests: interests || [],
      travelStyle: travelStyle || 'comfort',
      accommodationPreference: accommodationPreference || 'hotel',
    };

    // Gracefully fetch attraction data to enrich the prompt
    let travelData = {};
    try {
      const attractions = await placesService.searchAttractions(destination, 8);
      if (attractions.length > 0) {
        travelData.nearbyAttractions = attractions;
      }
    } catch {
      // Non-fatal — Gemini will use its own knowledge
    }

    const itinerary = await geminiService.generateItinerary(tripData, travelData);

    if (!validateItinerary(itinerary)) {
      return res.status(502).json({
        success: false,
        message: 'AI returned an invalid itinerary structure. Please try again.',
      });
    }

    // Persist trip with itinerary
    let trip;
    if (saveTripId) {
      // Attach to an existing trip (must be owned by user)
      const existing = await Trip.findById(saveTripId);
      if (!existing || existing.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Trip not found or access denied.' });
      }
      existing.itinerary = itinerary;
      existing.status = 'saved';
      trip = await existing.save();
    } else {
      // Create a new trip document
      trip = await Trip.create({
        userId: req.user._id,
        ...tripData,
        itinerary,
        status: 'saved',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Itinerary generated successfully.',
      trip,
    });
  } catch (error) {
    // Catch Gemini API-level errors
    if (error instanceof SyntaxError) {
      return res.status(502).json({
        success: false,
        message: 'AI returned a malformed response. Please try again.',
      });
    }
    next(error);
  }
};

/**
 * @route  POST /api/ai/chat
 * @desc   Chat with the AI assistant about a specific trip
 * @access Private
 */
const chat = async (req, res, next) => {
  try {
    const { tripId, message } = req.body;

    if (!tripId || !message) {
      return res.status(400).json({
        success: false,
        message: 'tripId and message are required.',
      });
    }

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Load last 10 messages for context
    const history = await ChatHistory.find({ tripId, userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const orderedHistory = history.reverse(); // Chronological order for Gemini

    // Get assistant response
    const assistantMessage = await geminiService.chatWithAssistant(trip, orderedHistory, message);

    // Persist both turns
    await ChatHistory.insertMany([
      { tripId, userId: req.user._id, role: 'user', message },
      { tripId, userId: req.user._id, role: 'assistant', message: assistantMessage },
    ]);

    res.json({
      success: true,
      reply: assistantMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  PUT /api/ai/modify-itinerary
 * @desc   Modify an existing trip itinerary based on user instructions
 * @access Private
 */
const modifyItinerary = async (req, res, next) => {
  try {
    const { modification, modifications } = req.body;
    const tripId = req.body.tripId || req.params.tripId;
    const modText = modification || modifications;

    if (!tripId || !modText) {
      return res.status(400).json({
        success: false,
        message: 'tripId and modification instructions are required.',
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (!trip.itinerary) {
      return res.status(400).json({
        success: false,
        message: 'This trip does not have an existing itinerary. Generate one first.',
      });
    }

    const updatedItinerary = await geminiService.modifyItinerary(
      trip.itinerary,
      modText,
      trip
    );

    if (!validateItinerary(updatedItinerary)) {
      return res.status(502).json({
        success: false,
        message: 'AI returned an invalid modified itinerary. Please try again.',
      });
    }

    trip.itinerary = updatedItinerary;
    await trip.save();

    res.json({
      success: true,
      message: 'Itinerary updated successfully.',
      trip,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(502).json({
        success: false,
        message: 'AI returned a malformed response. Please try again.',
      });
    }
    next(error);
  }
};

/**
 * @route  GET /api/ai/chat/:tripId
 * @desc   Get chat history for a trip
 * @access Private
 */
const getChatHistory = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Trip not found or access denied.' });
    }

    const history = await ChatHistory.find({
      tripId: req.params.tripId,
      userId: req.user._id,
    }).sort({ createdAt: 1 });

    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateItinerary, chat, modifyItinerary, getChatHistory };
