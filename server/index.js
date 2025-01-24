// Import required modules
const express = require('express');
const cors = require('cors'); // CORS middleware for cross-origin requests
const morgan = require('morgan'); // HTTP request logger middleware
const axios = require('axios');


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

// Route to handle API requests
app.get('/sports_api_test', async (req, res) => {
  var config = {
    method: 'get',
    url: process.env.API_SPORTS_URL + '/leagues',
    headers: {
      'x-rapidapi-host': process.env.API_SPORTS_HOST,
      'x-rapidapi-key': process.env.API_SPORTS_API_KEY
    }
  };
  
  axios(config)
  .then(function (response) {
    res.send(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });    
});

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});