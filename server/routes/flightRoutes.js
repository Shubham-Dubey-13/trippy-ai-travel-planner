const express = require('express');
const { query } = require('express-validator');
const { protect } = require('../middleware/auth');
const { searchFlights } = require('../controllers/flightController');

const router = express.Router();

// Validation rules for flight search
const flightSearchValidation = [
  query('origin').notEmpty().withMessage('origin (IATA code) is required').isLength({ min: 2, max: 3 }),
  query('destination').notEmpty().withMessage('destination (IATA code) is required').isLength({ min: 2, max: 3 }),
  query('date').notEmpty().withMessage('date (YYYY-MM-DD) is required').isISO8601().withMessage('date must be a valid ISO date'),
  query('adults').optional().isInt({ min: 1, max: 9 }).withMessage('adults must be between 1 and 9'),
];

router.get('/search', protect, flightSearchValidation, searchFlights);

module.exports = router;
