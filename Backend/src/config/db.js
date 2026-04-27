import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {

    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected successfully');
}


export default connectDB;