// db.js
const mongoose = require("mongoose");
 

// MongoDB connection string (replace with your actual URI)

// const MONGO_URI = "mongodb+srv://hammadhabib0890:12345678_a_b@water-plant-db.ritlp.mongodb.net"
const MONGO_URI ="mongodb+srv://hammadhabib0890:123@water-plant-db.ritlp.mongodb.net/?retryWrites=true&w=majority&appName=Water-Plant-db";
   
const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      
    });
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      
    });
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // Retry logic - optional
    setTimeout(connectToDatabase, 5001); // Retry connecting after 5 seconds
  }
    // Retry logic - optional
    setTimeout(connectToDatabase, 5001); // Retry connecting after 5 seconds
  }
};

// Listen for MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection lost. Attempting to reconnect...");
})
 
 

// Export the connection function
module.exports = connectToDatabase;
