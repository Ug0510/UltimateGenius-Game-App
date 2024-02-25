const express = require('express');
const app = express();
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


// Allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));


// Middleware
app.use(bodyParser.json());

// Import routes
const routes = require('./routes');

// Use routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
