import mongoose from "mongoose";

export default async function dbConnection(): Promise<boolean> {
    console.log("Checking for connection...");

    if (mongoose.connection.readyState != 1) {
        console.log("Not connected! Starting connection...");

        if (!process.env.MONGO_URI) {
            console.log("MONGO_URI not configured!");
            return false;
        }

        try {
            await mongoose.connect(process.env.MONGO_URI);
        } catch (_) {
            console.log("Error during connection!");
            return false;
        }

        console.log("Connected!");
        return true;
    } else {
        console.log("Already connected!");
        return true;
    }
}
