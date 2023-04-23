import { dbConnection } from "@/database/dbConnection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ isConnected: boolean }>
) {
    const isConnected: boolean = await dbConnection();

    return res.status(isConnected ? 200 : 500).json({ isConnected });
}
