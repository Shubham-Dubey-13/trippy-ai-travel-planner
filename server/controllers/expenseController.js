const { validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

/**
 * @route  POST /api/expenses
 * @desc   Add a new expense to a trip
 * @access Private
 */
const addExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { tripId, category, description, amount, date } = req.body;

    // Verify the trip exists and belongs to the authenticated user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this trip.',
      });
    }

    const expense = await Expense.create({
      tripId,
      userId: req.user._id,
      category,
      description,
      amount: parseFloat(amount),
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/expenses/:tripId
 * @desc   Get all expenses for a trip with totals
 * @access Private
 */
const getExpensesByTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this trip.',
      });
    }

    const expenses = await Expense.find({ tripId, userId: req.user._id }).sort({ date: -1 });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Category-wise breakdown
    const breakdown = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      count: expenses.length,
      totalSpent,
      budget: trip.budget,
      remaining: trip.budget - totalSpent,
      breakdown,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  DELETE /api/expenses/:id
 * @desc   Delete an expense (user must own it)
 * @access Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addExpense, getExpensesByTrip, deleteExpense };
