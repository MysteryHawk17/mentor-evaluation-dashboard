import dotenv from 'dotenv';
dotenv.config();
export const DB_URL= process.env.MONGO_URI;
export const PORT= process.env.PORT || 5000;
