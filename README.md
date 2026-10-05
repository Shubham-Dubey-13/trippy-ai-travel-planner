# ✈️ Trippy — AI-Powered Travel Planning Platform

> Generate personalized, budget-aware travel itineraries with Gemini AI, integrated flight/hotel search, expense tracking, and a conversational travel assistant.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini API |
| Auth | JWT |
| Flights/Hotels | Amadeus Self-Service API |
| Attractions | OpenTripMap API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gemini API key (from [Google AI Studio](https://aistudio.google.com))
- Amadeus API credentials (optional, from [developers.amadeus.com](https://developers.amadeus.com))
- OpenTripMap API key (optional, from [opentripmap.io](https://opentripmap.io))

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in your API keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trippy
JWT_SECRET=your_super_secret_jwt_key_here

# Required — get from https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key

# Optional — get from https://developers.amadeus.com
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# Optional — get from https://opentripmap.io
OPENTRIPMAP_API_KEY=your_opentripmap_api_key

NODE_ENV=development
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
Trippy/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # Axios instance
│       ├── context/        # Auth context
│       ├── components/     # Shared components
│       └── pages/          # Route pages
│
└── server/                 # Node.js + Express backend
    ├── config/             # DB connection
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth, error handling
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    └── services/           # External API integrations
```

---

## 🔑 API Endpoints

| Module | Endpoint | Method | Description |
|---|---|---|---|
| Auth | `/api/auth/register` | POST | Create account |
| Auth | `/api/auth/login` | POST | Authenticate |
| Auth | `/api/auth/profile` | GET | Get profile |
| Trips | `/api/trips` | POST | Create trip |
| Trips | `/api/trips` | GET | List trips |
| Trips | `/api/trips/:id` | GET/PUT/DELETE | Manage trip |
| AI | `/api/ai/generate-itinerary` | POST | Generate itinerary |
| AI | `/api/ai/chat` | POST | Chat assistant |
| AI | `/api/ai/modify-itinerary` | POST | Modify itinerary |
| Flights | `/api/flights/search` | GET | Search flights |
| Hotels | `/api/hotels/search` | GET | Search hotels |
| Places | `/api/places/search` | GET | Search attractions |
| Expenses | `/api/expenses` | POST | Add expense |
| Expenses | `/api/expenses/trip/:tripId` | GET | List expenses |

---

## 🌟 Features

- **AI Itinerary Generation** — Gemini creates structured, day-by-day itineraries from your preferences
- **Flight & Hotel Search** — Amadeus API integration for real travel data
- **Attractions Discovery** — OpenTripMap powers points of interest
- **AI Chat Assistant** — Ask questions about your trip in natural language
- **Itinerary Modification** — Edit plans via natural language
- **Expense Tracker** — Track spending by category against your budget
- **Saved Trips** — Manage all your trips in one dashboard
- **Secure Auth** — JWT-based authentication with bcrypt password hashing

---

## 🔒 Security

- API keys stored in server-side `.env` — never exposed to the frontend
- Passwords hashed with bcrypt (10 salt rounds)
- JWT validation on all protected routes
- Rate limiting: 10 AI requests / 15 min, 30 search requests / 15 min
- Input validation with express-validator
- AI responses validated before persistence

---

## 📊 Resume Entry

**Trippy | React, Node.js, Express.js, MongoDB, Gemini API, REST APIs**
- Built an AI-powered travel planning platform using Gemini to generate personalized, budget-aware, day-by-day itineraries based on user preferences.
- Integrated REST APIs for flight, hotel and destination data, enabling users to explore travel options and attractions within the application.
- Developed a responsive React dashboard for itinerary management, AI recommendations, trip planning and expense tracking.
- Built a full-stack application using React, Node.js, Express.js and MongoDB with secure authentication and persistent trip management.

---

## 🚧 Development Phases

- [x] Phase 1 — Foundation (React + Express + MongoDB + JWT Auth)
- [x] Phase 2 — AI (Gemini itinerary generation + validation)
- [x] Phase 3 — Travel APIs (Amadeus flights/hotels + OpenTripMap)
- [x] Phase 4 — Product (Dashboard + Chat + Expense Tracker)
- [ ] Phase 5 — Deployment (Vercel + Render)

---

## 🔮 Future Enhancements

- Interactive maps and route optimization
- Multi-language itinerary generation
- Voice-based travel assistant
- Weather-aware itinerary adjustment
- Calendar export (ICS)
- Collaborative trip planning
- Mobile app (React Native)

---

*Built with ❤️ using Google Gemini AI*
