const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database'); 
const brochureRoutes = require("./routes/BrochureRoute");
const imageRoutes = require("./routes/ImageRoutes");

require('dotenv').config();

const tileRoutes = require('./routes/TileRoutes');
const app = express();

// Middleware
app.use(cors());
// Increase payload size limit for JSON and URL-encoded data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Star Porselano API' });
});

app.use('/api/tile', tileRoutes);
app.use("/api/brochure", brochureRoutes);   
app.use("/api/documents", imageRoutes);

// Database connection and server start
const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
