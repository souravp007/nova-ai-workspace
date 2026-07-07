import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        });

    } catch (error) {
        console.log(`Failed to start Server`, error);
        process.exit(1);
    }
};

startServer();