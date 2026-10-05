const express = require('express');
const { protect } = require('../middleware/auth');
const {
  generateItinerary,
  chat,
  modifyItinerary,
  getChatHistory,
} = require('../controllers/aiController');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post('/generate-itinerary', generateItinerary);
router.post('/chat', chat);
router.put('/modify-itinerary', modifyItinerary);
router.post('/modify-itinerary', modifyItinerary);
router.post('/modify-itinerary/:tripId', modifyItinerary);
router.get('/chat/:tripId', getChatHistory);

module.exports = router;
