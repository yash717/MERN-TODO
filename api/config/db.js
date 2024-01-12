const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


