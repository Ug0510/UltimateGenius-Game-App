const express = require('express');
const app = express();
const db = require('./config/mongoose');

// Import routes
const routes = require('./routes');

// Use routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
