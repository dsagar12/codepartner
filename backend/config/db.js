
const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL;

  

    try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send("Failed to connect to database");
        throw error;
    }
};

module.exports = connectDB;