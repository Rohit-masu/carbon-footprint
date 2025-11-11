const mongoose = require("mongoose");
require("dotenv").config();


mongoose.set('strictQuery', true); // avoid deprecation warnings

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carbon_footprint",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err}`);
});

module.exports = mongoose.connection;
