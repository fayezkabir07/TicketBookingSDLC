# MERN Ticket Booking Application

Complete end-to-end ticket booking app with:

- Frontend: React (Vite) + Hooks + Axios
- Backend: Node.js + Express REST API
- Database: MongoDB with Mongoose

## Folder Structure

```text
ticketBooking/
  Frontend/
    .env.example
    index.html
    package.json
    vite.config.js
    src/
      App.jsx
      main.jsx
      components/
        Layout.jsx
        ProtectedRoute.jsx
      context/
        AuthContext.jsx
      pages/
        LoginPage.jsx
        MovieDetailsPage.jsx
        MovieListPage.jsx
        SignupPage.jsx
        SuccessPage.jsx
      services/
        api.js
      styles/
        global.css
  Server/
    .env.example
    package.json
    server.js
    config/
      DB.js
      seedMovies.js
    controllers/
      authController.js
      movieController.js
      ticketBookingController.js
    middleware/
      authMiddleware.js
    models/
      Movie.js
      User.js
      ticketbooking.js
    router/
      ticketbookingroute.js
    routes/
      authRoutes.js
      movieRoutes.js
      ticketBookingRoutes.js
    utils/
      validators.js
  .gitignore
  README.md
```

## Backend Setup (`Server`)

1. Go to backend folder:
   - `cd Server`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` and update values:
   - `MONGO_URL=your_mongo_connection_string`
   - `PORT=7100`
   - `JWT_SECRET=your_secret_key`
   - `CLIENT_URL=http://localhost:6500`
4. Run backend:
   - Development: `npm run dev`
   - Production: `npm start`

Backend runs at: `http://localhost:7100`

## Frontend Setup (`Frontend`)

1. Go to frontend folder:
   - `cd Frontend`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example`:
   - `VITE_API_BASE_URL=http://localhost:7100/api/ticketbooking`
4. Run frontend:
   - `npm run dev`

Frontend runs at: `http://localhost:6500`

## API Base URL

- Backend API base URL:
  - `http://localhost:7100/api/ticketbooking`

## API Endpoints

### Auth

- `POST /api/ticketbooking/auth/signup`
- `POST /api/ticketbooking/auth/login`

### Movies

- `GET /api/ticketbooking/movies`
- `GET /api/ticketbooking/movies/:id`
- `POST /api/ticketbooking/movies` (protected)
- `PUT /api/ticketbooking/movies/:id` (protected)
- `DELETE /api/ticketbooking/movies/:id` (protected)

### Bookings

- `GET /api/ticketbooking/bookings/movie/:movieId/:timeSlot` (booked seats by show)
- `POST /api/ticketbooking/bookings` (protected)
- `GET /api/ticketbooking/bookings/my-bookings` (protected)
- `GET /api/ticketbooking/bookings/:id` (protected)
- `PUT /api/ticketbooking/bookings/:id` (protected)
- `DELETE /api/ticketbooking/bookings/:id` (protected - marks cancelled)

## Example Requests and Responses

### 1) Signup

Request:

```json
{
  "name": "Kabir Khan",
  "email": "kabir@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "message": "Signup successful.",
  "data": {
    "user": {
      "id": "6655e6f8dc4f7d2d1af4ab10",
      "name": "Kabir Khan",
      "email": "kabir@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### 2) Login

Request:

```json
{
  "email": "kabir@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "6655e6f8dc4f7d2d1af4ab10",
      "name": "Kabir Khan",
      "email": "kabir@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### 3) Create Booking

Request (with `Authorization: Bearer <token>`):

```json
{
  "movieId": "6655f1e7dc4f7d2d1af4ac01",
  "timeSlot": "06:30 PM",
  "seats": [
    { "row": "A", "number": 1, "label": "A1" },
    { "row": "A", "number": 2, "label": "A2" }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Booking confirmed successfully.",
  "data": {
    "_id": "6655f4bfdc4f7d2d1af4ad56",
    "timeSlot": "06:30 PM",
    "seatCount": 2,
    "totalAmount": 500,
    "status": "CONFIRMED"
  }
}
```

## Notes / Assumptions

- Used `http://localhost` for local development. The requirement mentioned `https://localhost`, but HTTPS certificates are not configured in this scaffold by default.
- Two default movies are automatically seeded if movie collection is empty.
- Movie create/update/delete endpoints are protected by JWT (no separate admin role was requested, so authenticated user can perform these operations).
- Booking delete is implemented as soft cancel (`status = CANCELLED`) so booking history stays available.
