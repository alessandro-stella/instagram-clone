import { dbConnection } from "@/database/dbConnection";
import User from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\"#$%&'()*+,-.\/:;<=>?@\[\]\\^_`{|}~])[A-Za-z\d!\"#$%&'()*+,-.\/:;<=>?@\[\]\\^_`{|}~\s]{8,}$/;

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isConnected: boolean = await dbConnection();

    if (!isConnected)
        return res
            .status(500)
            .json({ error: "We couldn't reach the database" });

    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    if (!req.body) return res.status(400).json({ error: "Data is missing" });

    const { username, email, password } = JSON.parse(req.body) as {
        username: string;
        email: string;
        password: string;
    };

    console.log({ username, email, password });

    if (!username || !email || !password)
        return res.status(400).json({ error: "Data is missing" });

    const userExists = await User.findOne({ email });

    if (userExists)
        return res.status(409).json({ error: "User already registered" });

    if (!password.match(passwordRegex))
        return res.status(400).json({ error: "Invalid password" });

    const createResponse = await User.create({
        username,
        email,
        password,
    }).catch((error) => ({ error: error.errors }));

    if (createResponse.error)
        for (const field in createResponse.error) {
            return res
                .status(409)
                .json({ error: createResponse.error[field].message });
        }

    return res.status(200).json({ success: true });
}
