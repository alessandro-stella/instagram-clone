import mongoose from "mongoose";
const URI = process.env.MONGO_URI;

export async function dbConnection(): Promise<boolean> {
    console.log("Checking for connection...");

    if (mongoose.connection.readyState != 1) {
        console.log("Not connected! Starting connection...");

        if (!URI) {
            throw new Error("Missing ENV variable: MONGO_URI");
        }

        try {
            const { connection } = await mongoose.connect(URI);

            if (connection.readyState === 1) {
                console.log("Connection established successfully!\n");
                return Promise.resolve(true);
            }
        } catch (_) {
            console.log("Error during connection!\n");
            return Promise.reject(false);
        }
    }

    console.log("Already connected!\n");
    return Promise.resolve(true);
}
