// Import required modules
const express = require('express');
const cors = require('cors'); // CORS middleware for cross-origin requests
const morgan = require('morgan'); // HTTP request logger middleware
const axios = require('axios');

const connectDB = require('./config/db');

const LeagueRoot = require("./models/football/LeagueRoot");
const League = require("./models/football/League");
const Country = require("./models/football/Country");
const Season = require("./models/football/Season");
const Coverage = require("./models/football/Coverage");

module.exports = {
  LeagueRoot,
  League,
  Country,
  Season,
  Coverage,
};    

// Initialize the Express app
const app = express();

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for parsing incoming JSON requests
app.use(express.json());

// Middleware for enabling CORS (cross-origin resource sharing)
app.use(cors());

// Define a simple route for the home page (GET request)
app.get('/', (req, res) => {
  res.send('Hello, world! Welcome to the Express backend server.');
});

// Define a sample route (POST request)
app.post('/data', (req, res) => {
  const receivedData = req.body;  // Access JSON data sent in the body
  console.log('Received data:', receivedData);
  res.json({
    message: 'Data received successfully!',
    data: receivedData
  });
});
  // Define Sports API routes
  const sportsApiRoutes = require('./sportsApi');

  app.use('/sports_api', sportsApiRoutes);

// Example of a route with a URL parameter (e.g., /user/:id)
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ID: ${userId}` });
});

// Handle 404 errors (when no route matches)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Start the server after the DB connection is established
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
      console.error('Failed to connect to the database:', err);
      process.exit(1); // Exit the process if the database connection fails
  });