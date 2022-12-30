import mongoose from 'mongoose';

import User from './user';
import Company from './company';
import Trade from './trade';

mongoose.set('strictQuery', false);

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

const models = { User, Company, Trade };

export { connectDb };

export default models;