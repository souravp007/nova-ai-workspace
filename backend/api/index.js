import app from '../src/app.js';
import connectDB from '../src/config/db.js';

let isDbConnected = false;

const ensureDbConnection = async () => {
    if (!isDbConnected) {
        await connectDB();
        isDbConnected = true;
    }
};

export default async function handler(req, res) {
    await ensureDbConnection();
    return app(req, res);
}
