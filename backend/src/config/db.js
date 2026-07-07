import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connect successfully`);

    } catch (error) {
        console.log(`MongoDb connection Error : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;