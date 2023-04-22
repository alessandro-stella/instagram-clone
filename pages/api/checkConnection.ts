import dbConnection from "@/database/dbConnection";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
    isConnected: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const isConnected: boolean = await dbConnection();

    return res.status(isConnected ? 200 : 500).json({ isConnected });
}
