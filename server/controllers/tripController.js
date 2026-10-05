const Trip = require('../models/Trip');

/**
 * @route  POST /api/trips
 * @desc   Create a new trip (without itinerary — use AI route to generate one)
 * @access Private
 */
const createTrip = async (req, res, next) => {
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
    } = req.body;

    if (!source || !destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: 'source, destination, startDate, endDate, and budget are required.',
      });
    }

    const trip = await Trip.create({
      userId: req.user._id,
      source,
      destination,
      startDate,
      endDate,
      travelers: travelers || 1,
      budget,
      interests: interests || [],
      travelStyle: travelStyle || 'comfort',
      accommodationPreference: accommodationPreference || 'hotel',
      status: 'draft',
    });

    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/trips
 * @desc   Get all trips belonging to the authenticated user
 * @access Private
 */
const getTrips = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Trip.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      trips,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/trips/:id
 * @desc   Get a single trip by ID (user must own it)
 * @access Private
 */
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this trip.' });
    }

    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  PUT /api/trips/:id
 * @desc   Update a trip (user must own it)
 * @access Private
 */
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this trip.' });
    }

    const allowedUpdates = [
      'source', 'destination', 'startDate', 'endDate', 'travelers',
      'budget', 'interests', 'travelStyle', 'accommodationPreference',
      'itinerary', 'status',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();

    res.json({ success: true, message: 'Trip updated successfully.', trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  DELETE /api/trips/:id
 * @desc   Delete a trip (user must own it)
 * @access Private
 */
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this trip.' });
    }

    await trip.deleteOne();

    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip };
