import mongoose from 'mongoose';

/**
 * This file is responsible for establishing a connection to the MongoDB database.
 * It uses Mongoose to connect to the database specified in the MONGO_URI environment variable.
 */

const connectDb = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;
    
    console.log('Mongo URI from environment variables:', mongoUri);

    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB is already connected.');
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log('MongoDB connected successfully.');
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Error details:', error);
        throw error;
    }
};

export default connectDb;
