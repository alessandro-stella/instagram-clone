import { dbConnection } from "@/database/dbConnection";
import TempUser from "@/database/models/tempUserModel";
import User from "@/database/models/userModel";
import { passwordRegex } from "@/utils/regex";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import { NextApiRequest, NextApiResponse } from "next";

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

    const { newUserId, username, email, password } = JSON.parse(req.body) as {
        newUserId: string;
        username: string;
        email: string;
        password: string;
    };

    if (newUserId) {
        const registrationIsValid = await TempUser.findById(newUserId).catch(
            (error) => ({ error })
        );

        if (!registrationIsValid || registrationIsValid.error)
            return res
                .status(401)
                .json({ error: "Registration time is elapsed" });

        const deleteResponse = await TempUser.deleteOne({
            _id: newUserId,
        });

        if (!deleteResponse.acknowledged || deleteResponse.deletedCount != 1)
            return res.status(500).json({ error: "Error during the process" });
    }

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

    console.log({ createResponse });

    await sendVerificationEmail(
        username,
        email,
        createResponse.verificationCode
    );

    return res.status(200).json({ success: true });
}
