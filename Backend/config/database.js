const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://meetprog6401:GSZ1yUPNBl4e6cS8@star-porselano.2q0s0ar.mongodb.net/?retryWrites=true&w=majority&appName=Star-Porselano', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 