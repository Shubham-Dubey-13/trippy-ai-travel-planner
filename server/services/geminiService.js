const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Strips markdown code fences from a string that may wrap JSON.
 */
const stripMarkdown = (text) => {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
};

/**
 * Safely parses a JSON string, stripping markdown if needed.
 */
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const stripped = stripMarkdown(text);
    return JSON.parse(stripped);
  }
};

/**
 * Builds the full itinerary generation prompt.
 */
const buildItineraryPrompt = (tripData, travelData) => {
  const startDate = new Date(tripData.startDate);
  const endDate = new Date(tripData.endDate);
  const duration = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const travelDataJSON =
    travelData && Object.keys(travelData).length > 0
      ? JSON.stringify(travelData, null, 2)
      : 'No pre-fetched travel data available. Use your knowledge for general estimates.';

  return `You are an expert travel planner. Generate a detailed day-by-day travel itinerary based on the information below.

IMPORTANT RULES:
1. Output ONLY valid JSON - no markdown, no explanation text
2. Do NOT invent flight or hotel prices - use only the provided API data
3. Keep total estimated costs within the budget
4. Be specific about locations, timings, and activities

Trip Details:
- From: ${tripData.source}
- Destination: ${tripData.destination}
- Duration: ${duration} days
- Travelers: ${tripData.travelers || 1}
- Budget: INR ${tripData.budget}
- Interests: ${(tripData.interests || []).join(', ') || 'General sightseeing'}
- Travel Style: ${tripData.travelStyle || 'comfort'}
- Accommodation: ${tripData.accommodationPreference || 'hotel'}

Available Travel Data (use these facts, do not invent similar data):
${travelDataJSON}

Generate a JSON response in this exact format:
{
  "destination": "string",
  "duration": number,
  "estimatedBudget": number,
  "currency": "INR",
  "highlights": ["string"],
  "bestTimeToVisit": "string",
  "accommodation": {
    "name": "string",
    "type": "string",
    "estimatedCostPerNight": number,
    "notes": "string"
  },
  "transportation": {
    "toDestination": "string",
    "localTransport": "string",
    "estimatedCost": number
  },
  "days": [
    {
      "day": number,
      "theme": "string",
      "activities": [
        {
          "time": "Morning|Afternoon|Evening|Night",
          "place": "string",
          "description": "string",
          "estimatedCost": number,
          "tips": "string"
        }
      ],
      "meals": [
        {
          "type": "Breakfast|Lunch|Dinner",
          "place": "string",
          "cuisine": "string",
          "estimatedCost": number
        }
      ],
      "dailyEstimatedCost": number
    }
  ],
  "packingList": ["string"],
  "travelTips": ["string"],
  "emergencyContacts": {
    "police": "string",
    "ambulance": "string",
    "touristHelpline": "string"
  }
}`;
};

/**
 * Generates a full day-by-day travel itinerary using Gemini.
 * @param {Object} tripData  - Trip details from the request body
 * @param {Object} travelData - Pre-fetched flight/hotel/attraction data
 * @returns {Object} Parsed itinerary JSON object
 */
const generateItinerary = async (tripData, travelData = {}) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildItineraryPrompt(tripData, travelData);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const itinerary = safeParseJSON(text);
  return itinerary;
};

/**
 * Multi-turn chat with a context-aware travel assistant.
 * @param {Object} tripData     - The trip object from the database
 * @param {Array}  chatHistory  - Array of {role, message} objects (last 10)
 * @param {string} userMessage  - The new user message
 * @returns {string} The assistant's response message
 */
const chatWithAssistant = async (tripData, chatHistory, userMessage) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Build Gemini-compatible history format
  const history = chatHistory.map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.message }],
  }));

  const systemContext = `You are Trippy, a friendly and knowledgeable AI travel assistant. 
You are helping a traveler plan or discuss their trip with the following details:
- From: ${tripData.source} → To: ${tripData.destination}
- Travel Dates: ${tripData.startDate ? new Date(tripData.startDate).toDateString() : 'TBD'} to ${tripData.endDate ? new Date(tripData.endDate).toDateString() : 'TBD'}
- Budget: INR ${tripData.budget}
- Travelers: ${tripData.travelers || 1}
- Style: ${tripData.travelStyle || 'comfort'}
- Interests: ${(tripData.interests || []).join(', ') || 'General sightseeing'}

Answer questions helpfully, make suggestions, and keep responses concise and practical.`;

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemContext }],
      },
      {
        role: 'model',
        parts: [
          {
            text: `Hello! I'm Trippy, your travel assistant. I'm ready to help you plan your trip from ${tripData.source} to ${tripData.destination}. What would you like to know?`,
          },
        ],
      },
      ...history,
    ],
    generationConfig: {
      maxOutputTokens: 1024,
    },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};

/**
 * Modifies an existing itinerary based on a user instruction.
 * @param {Object} existingItinerary - The current itinerary JSON
 * @param {string} modification      - The modification request from the user
 * @param {Object} tripData          - Original trip data for context
 * @returns {Object} Updated itinerary JSON object
 */
const modifyItinerary = async (existingItinerary, modification, tripData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert travel planner. You must modify the existing travel itinerary below based on the user's modification request.

IMPORTANT RULES:
1. Output ONLY valid JSON - no markdown, no explanation text
2. Keep the same JSON structure as the existing itinerary
3. Apply the modification thoughtfully while keeping the overall trip coherent
4. Do not change fields that are not related to the modification

Existing Itinerary:
${JSON.stringify(existingItinerary, null, 2)}

Trip Context:
- Destination: ${tripData.destination}
- Budget: INR ${tripData.budget}
- Travelers: ${tripData.travelers || 1}

Modification Request:
"${modification}"

Return the complete, updated itinerary in the exact same JSON structure.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const updatedItinerary = safeParseJSON(text);
  return updatedItinerary;
};

module.exports = { generateItinerary, chatWithAssistant, modifyItinerary };
