// for mongoDB connection
const mongoose = require("mongoose");
// require the directory
const config = require("config");
// get all contents of JSON file
const db = config.get("mongoURI");

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log("Mongo DB connected");
  } catch (err) {
    console.log(err.message);
    //exit if failure
    process.exit(1);
  }
};

module.exports = connectDb;
