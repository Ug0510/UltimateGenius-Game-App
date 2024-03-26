const express = require('express');
const app = express();
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware
app.use(bodyParser.json());

// Import routes
const routes = require('./routes');

// Use routes
app.use('/', routes);

// Serve static files from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/avatar'); // save uploaded files to the assets/avatar folder
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = 'avatar-' + Date.now() + extension; // append timestamp to filename
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Handle avatar upload endpoint
app.post('/upload', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }

   // If file upload is successful, send the path of the uploaded image
   const imagePath = `http://${req.hostname}/assets/avatar/${req.file.filename}`;
   res.send({ imagePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
