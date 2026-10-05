const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Departure city is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
      max: [50, 'Maximum 50 travelers allowed'],
      default: 1,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    interests: {
      type: [String],
      default: [],
    },
    travelStyle: {
      type: String,
      enum: ['budget', 'comfort', 'luxury', 'adventure', 'cultural'],
      default: 'comfort',
    },
    accommodationPreference: {
      type: String,
      enum: ['hostel', 'hotel', 'resort', 'airbnb', 'camping'],
      default: 'hotel',
    },
    // Stores the full Gemini-generated itinerary as a flexible JSON object
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
  }
);

// ─── Virtual: Duration in Days ────────────────────────────────────────────────
tripSchema.virtual('durationDays').get(function () {
  if (!this.startDate || !this.endDate) return null;
  const diffMs = this.endDate - this.startDate;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
