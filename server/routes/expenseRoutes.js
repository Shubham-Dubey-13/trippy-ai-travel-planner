const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { addExpense, getExpensesByTrip, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

// All expense routes require authentication
router.use(protect);

// Validation rules for adding an expense
const addExpenseValidation = [
  body('tripId').notEmpty().withMessage('tripId is required').isMongoId().withMessage('tripId must be a valid ID'),
  body('category')
    .notEmpty()
    .withMessage('category is required')
    .customSanitizer(val => (val || '').toLowerCase())
    .isIn(['transportation', 'accommodation', 'food', 'activities', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('amount must be a non-negative number'),
  body('date').optional().isISO8601().withMessage('date must be a valid ISO date'),
];

router.post('/', addExpenseValidation, addExpense);
router.get('/trip/:tripId', getExpensesByTrip);   // frontend uses this
router.get('/:tripId', getExpensesByTrip);         // keep for compatibility
router.delete('/:id', deleteExpense);

module.exports = router;
