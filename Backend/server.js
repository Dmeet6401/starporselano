const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const imageRoutes = require("./routes/ImageRoutes");
const sanitaryRoutes = require("./routes/SanitaryRoutes");
const brochureRoutes = require("./routes/BrochureRoute");

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
app.use("/api/images", imageRoutes);
app.use("/api/sanitary", sanitaryRoutes);
app.use("/api/brochure", brochureRoutes);

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development, you might want to use { force: true })
    await sequelize.sync();
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
