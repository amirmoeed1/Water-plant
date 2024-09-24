// db.js
const mongoose = require('mongoose');

// MongoDB connection string (replace with your actual URI)
const MONGO_URI = 'mongodb+srv://hammadhabib0890:5oZW6l6Fe1qBx55W@water-plant-db.ritlp.mongodb.net/?retryWrites=true&w=majority&appName=Water-Plant-db';

// Function to connect to MongoDB
const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds if unable to connect
        });
        console.log(`MongoDB connected successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);

        // Retry logic - optional
        setTimeout(connectToDatabase, 5000); // Retry connecting after 5 seconds
    }
};

// Listen for MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection lost. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB successfully reconnected!');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
});

// Export the connection function
module.exports = connectToDatabase;
