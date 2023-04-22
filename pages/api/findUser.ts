import dbConnection from "@/database/dbConnection";
import User, { userType } from "@/database/models/userModel";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<userType | { isConnected: boolean } | null>
) {
    console.log("Starting to call findUser");
    const isConnected = await dbConnection();
    console.log({ isConnected });

    if (!isConnected) {
        return res.status(500).json({ isConnected });
    }

    console.log("Connection established, keep going");

    const email = req.body.email;

    const user: userType | null = await User.findOne({ email });
    console.log("Find one completed");

    return res.status(user ? 200 : 400).json(user);
}
