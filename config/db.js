const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (err) {
    console.log(`Mongodb server issue ${err}`.bgRed.white);
  }
};
module.exports = connectDB;
