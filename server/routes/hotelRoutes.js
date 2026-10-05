const express = require('express');
const { query } = require('express-validator');
const { protect } = require('../middleware/auth');
const { searchHotels } = require('../controllers/hotelController');

const router = express.Router();

// Validation rules for hotel search
const hotelSearchValidation = [
  query('destination').notEmpty().withMessage('destination (IATA city code) is required'),
  query('checkIn').notEmpty().withMessage('checkIn date is required').isISO8601().withMessage('checkIn must be a valid ISO date'),
  query('checkOut').notEmpty().withMessage('checkOut date is required').isISO8601().withMessage('checkOut must be a valid ISO date'),
  query('adults').optional().isInt({ min: 1, max: 20 }).withMessage('adults must be between 1 and 20'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
];

router.get('/search', protect, hotelSearchValidation, searchHotels);

module.exports = router;
