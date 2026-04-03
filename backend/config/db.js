const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected successfully! Host: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error Detailed:');
        console.error(`Message: ${error.message}`);
        console.error(`Code: ${error.code}`);
        if (error.reason) console.error(`Reason: ${error.reason}`);
        process.exit(1);
    }
};

module.exports = connectDB;
